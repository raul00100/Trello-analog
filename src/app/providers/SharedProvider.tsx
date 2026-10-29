"use client";

import { useState, useEffect, useRef } from "react";
import type { FC, ReactNode } from "react";
import type { Board } from "../../features/boards/model/boardTypes";
import { loadBoards, saveBoards } from "../../features/boards/model/boardStorage";
import { SharedContext } from "../../shared/context/sharedContext";
import { getSupabaseClient } from "../../shared/lib/supabaseClient";

export const SharedProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [boards, setBoards] = useState<Board[]>([]);
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

  const retryStorage = () => {
    boardsLoadedRef.current = false;
    setStorageError(null);
    setStorageStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    const savedMore = localStorage.getItem("more");
    if (savedMore) setMore(JSON.parse(savedMore));
    setPreferencesLoaded(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let activeUserId: string | null = null;
    let supabase: ReturnType<typeof getSupabaseClient>;
    try {
      supabase = getSupabaseClient();
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "Could not connect to Supabase."
      );
      setStorageStatus("error");
      setAuthStatus("signedOut");
      return;
    }

    const loadUserBoards = async (userId: string) => {
      try {
        const loadedBoards = await loadBoards(userId);
        if (cancelled) return;
        setBoards(loadedBoards);
        boardsLoadedRef.current = true;
        setStorageError(null);
        setStorageStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setStorageError(
          error instanceof Error ? error.message : "Could not load your boards."
        );
        setStorageStatus("error");
      }
    };

    const handleSession = (userId: string | null) => {
      if (userId === activeUserId && boardsLoadedRef.current) {
        return;
      }
      activeUserId = userId;

      if (!userId) {
        userIdRef.current = null;
        boardsLoadedRef.current = false;
        setBoards([]);
        setAuthStatus("signedOut");
        setStorageStatus("ready");
        setStorageError(null);
        return;
      }

      userIdRef.current = userId;
      boardsLoadedRef.current = false;
      setAuthStatus("signedIn");
      setStorageStatus("loading");
      void loadUserBoards(userId);
    };

    const clearOldAnonymousSession = async () => {
      const { error } = await supabase.auth.signOut({ scope: "local" });
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
      const user = session?.user;
      if (user?.is_anonymous) {
        queueMicrotask(() => void clearOldAnonymousSession());
        return;
      }
      queueMicrotask(() => handleSession(user?.id ?? null));
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (cancelled) return;
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
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loadAttempt === 0 || !userIdRef.current) return;
    setStorageStatus("loading");
    setStorageError(null);
    boardsLoadedRef.current = false;
    void loadBoards(userIdRef.current)
      .then((loadedBoards) => {
        setBoards(loadedBoards);
        boardsLoadedRef.current = true;
        setStorageStatus("ready");
      })
      .catch((error: unknown) => {
        setStorageError(
          error instanceof Error ? error.message : "Could not load your boards."
        );
        setStorageStatus("error");
      });
  }, [loadAttempt]);

  const signIn = async (email: string, password: string) => {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const register = async (email: string, password: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;

    return !data.session;
  };

  const signOut = async () => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    if (storageStatus !== "ready" || !boardsLoadedRef.current) return;
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
          error instanceof Error ? error.message : "Could not save your boards."
        );
      });
  }, [boards, storageStatus]);

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

  const addBoard = (navigate?: (path: string) => void) => {
    if (boards.length === 0) {
      setBoards([{ id: crypto.randomUUID(), name: "Board 1", lists: [] }]);
    } else {
      setBoards([
        ...boards,
        { id: crypto.randomUUID(), name: "", lists: [] },
      ]);
    }
    if (navigate) navigate(`/board/${boards.length}`);
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
