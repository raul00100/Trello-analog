"use client";

import { useState, useEffect, useRef } from "react";
import type { FC, ReactNode } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Board } from "../../features/boardContent/model/boardTypes";
import {
  loadBoardsOrCreateInitial,
  saveBoards,
} from "../../features/boardContent/model/boardStorage";
import {
  validateEmail,
  validatePassword,
  validateRegistration,
} from "../../features/auth/model/authValidation";
import { SharedContext } from "./sharedContext";
import { getSupabaseClient } from "../lib/supabaseClient";

export const SharedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoardsState] = useState<Board[]>([]);
  const [boardsChanged, setBoardsChanged] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    "loading" | "signedOut" | "signedIn"
  >("loading");
  const [storageStatus, setStorageStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [storageError, setStorageError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [more, setMore] = useState(false);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const [searchColumn, setSearchColumn] = useState<string | undefined>("");
  const userIdRef = useRef<string | null>(null);
  const boardsLoadedRef = useRef(false);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const loadGenerationRef = useRef(0);

  const setBoards: Dispatch<SetStateAction<Board[]>> = (action) => {
    setBoardsChanged(true);
    setBoardsState(action);
  };

  const retryStorage = () => {
    boardsLoadedRef.current = false;
    setStorageError(null);
    setStorageStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    const savedMore = localStorage.getItem("more");
    if (savedMore) {
      try {
        const savedValue: unknown = JSON.parse(savedMore);
        if (typeof savedValue === "boolean") setMore(savedValue);
      } catch {
        localStorage.removeItem("more");
      }
    }
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activeUserId: string | null = null;
    const loadingUserIds = new Set<string>();
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      supabase = getSupabaseClient();
    } catch (error) {
      setStorageError(
        error instanceof Error
          ? error.message
          : "Could not connect to Supabase.",
      );
      setStorageStatus("error");
      setAuthStatus("signedOut");
      return;
    }

    const loadUserBoards = async (userId: string) => {
      if (loadingUserIds.has(userId)) return;
      loadingUserIds.add(userId);
      const loadGeneration = loadGenerationRef.current;

      try {
        const loadedBoards = await loadBoardsOrCreateInitial(userId);
        if (
          cancelled ||
          userIdRef.current !== userId ||
          loadGenerationRef.current !== loadGeneration
        ) {
          return;
        }
        setBoardsChanged(false);
        setBoardsState(loadedBoards);
        boardsLoadedRef.current = true;
        setStorageError(null);
        setStorageStatus("ready");
      } catch (error) {
        if (
          cancelled ||
          userIdRef.current !== userId ||
          loadGenerationRef.current !== loadGeneration
        ) {
          return;
        }
        setStorageError(
          error instanceof Error
            ? error.message
            : "Could not load your boards.",
        );
        setStorageStatus("error");
      } finally {
        loadingUserIds.delete(userId);
      }
    };

    const handleSession = (userId: string | null) => {
      if (
        userId === activeUserId &&
        (boardsLoadedRef.current ||
          (userId !== null && loadingUserIds.has(userId)))
      ) {
        return;
      }
      activeUserId = userId;
      loadGenerationRef.current += 1;

      if (!userId) {
        userIdRef.current = null;
        boardsLoadedRef.current = false;
        setBoardsChanged(false);
        setBoardsState([]);
        setAuthStatus("signedOut");
        setStorageStatus("ready");
        setStorageError(null);
        return;
      }

      userIdRef.current = userId;
      boardsLoadedRef.current = false;
      setBoardsChanged(false);
      setAuthStatus("signedIn");
      setStorageStatus("loading");
      void loadUserBoards(userId);
    };

    const clearOldAnonymousSession = async () => {
      if (cancelled) return;
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (cancelled) return;
      if (error) {
        setStorageError(error.message);
        setStorageStatus("error");
        return;
      }
      handleSession(null);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => {
        if (cancelled) return;
        const user = session?.user;
        if (user?.is_anonymous) {
          void clearOldAnonymousSession();
          return;
        }
        handleSession(user?.id ?? null);
      });
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setStorageError(error.message);
          setStorageStatus("error");
          return;
        }
        const user = data.session?.user;
        if (user?.is_anonymous) {
          void clearOldAnonymousSession();
          return;
        }
        handleSession(user?.id ?? null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setStorageError(
          error instanceof Error
            ? error.message
            : "Could not read your session.",
        );
        setStorageStatus("error");
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loadAttempt === 0 || !userIdRef.current) return;
    const userId = userIdRef.current;
    const loadGeneration = ++loadGenerationRef.current;
    setStorageStatus("loading");
    setStorageError(null);
    boardsLoadedRef.current = false;
    let cancelled = false;
    void loadBoardsOrCreateInitial(userId)
      .then((loadedBoards) => {
        if (
          cancelled ||
          userIdRef.current !== userId ||
          loadGenerationRef.current !== loadGeneration
        ) {
          return;
        }
        setBoardsChanged(false);
        setBoardsState(loadedBoards);
        boardsLoadedRef.current = true;
        setStorageStatus("ready");
      })
      .catch((error: unknown) => {
        if (
          cancelled ||
          userIdRef.current !== userId ||
          loadGenerationRef.current !== loadGeneration
        ) {
          return;
        }
        setStorageError(
          error instanceof Error
            ? error.message
            : "Could not load your boards.",
        );
        setStorageStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  const signIn = async (email: string, password: string) => {
    const validationError = validateEmail(email) ?? validatePassword(password);
    if (validationError) throw new Error(validationError);

    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;
  };

  const register = async (name: string, email: string, password: string) => {
    const validationError = validateRegistration(
      name,
      email,
      password,
      password,
    );
    if (validationError) throw new Error(validationError);

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name.trim() },
      },
    });
    if (error) throw error;

    return !data.session;
  };

  const signOut = async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    if (
      storageStatus !== "ready" ||
      !boardsLoadedRef.current ||
      !boardsChanged
    ) {
      return;
    }
    const userId = userIdRef.current;
    if (!userId) return;

    const boardsToSave = boards;
    saveQueueRef.current = saveQueueRef.current
      .then(async () => {
        await saveBoards(boardsToSave, userId);
        setStorageError(null);
      })
      .catch((error: unknown) => {
        setStorageError(
          error instanceof Error
            ? error.message
            : "Could not save your boards.",
        );
      });
  }, [boards, boardsChanged, storageStatus]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem("more", JSON.stringify(more));
  }, [more, preferencesLoaded]);

  //clear the searched column after 5s when user went through the search page to the exact column
  useEffect(() => {
    if (searchColumn) {
      const timer = setTimeout(() => {
        setSearchColumn(undefined);
      }, 5000);

      return clearTimeout(timer);
    }
  }, [searchColumn]);

  const addBoard = (name: string) => {
    const id = crypto.randomUUID();
    setBoards((currentBoards) => [
      ...currentBoards,
      {
        id,
        name,
        lists: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    return id;
  };

  return (
    <SharedContext.Provider
      value={{
        authStatus,
        signIn,
        register,
        signOut,
        boards,
        setBoards,
        storageStatus,
        storageError,
        retryStorage,
        more,
        setMore,
        addBoard,
        searchColumn,
        setSearchColumn,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};
