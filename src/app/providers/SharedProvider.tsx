"use client";

import { useState, useEffect, useRef } from "react";
import type { FC, ReactNode } from "react";
import type { Board } from "../../features/boards/model/boardTypes";
import {
  clearLegacyBoards,
  loadBoards,
  loadLegacyBoards,
  saveBoards,
} from "../../features/boards/model/boardStorage";
import { SharedContext } from "../../shared/context/sharedContext";
import { getSupabaseClient } from "../../shared/lib/supabaseClient";

export const SharedProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [boards, setBoards] = useState<Board[]>([]);
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

    const initializeStorage = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        let user = sessionData.session?.user ?? null;
        if (!user) {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
          user = data.user;
        }

        if (!user) throw new Error("Supabase did not return a user session.");
        userIdRef.current = user.id;

        let loadedBoards = await loadBoards(user.id);
        if (loadedBoards.length === 0) {
          const legacyBoards = loadLegacyBoards();
          if (legacyBoards.length > 0) {
            await saveBoards(legacyBoards, user.id);
            clearLegacyBoards();
            loadedBoards = legacyBoards;
          }
        }

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

    void initializeStorage();
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

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
