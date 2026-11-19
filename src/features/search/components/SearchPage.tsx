"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import type { SearchHistoryItem } from "../model/searchTypes";
import { Input } from "../../../shared/components/ui/input";
import SearchHistory from "./SearchHistory";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchPage() {
  const { boards, setSearchColumn } = useSharedProvider();
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const pathname = location.pathname;
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const historyInitialized = useRef(false);

  useEffect(() => {
    if (historyInitialized.current) return;
    historyInitialized.current = true;
    const savedHistory = localStorage.getItem("history");
    if (savedHistory) {
      const storedHistory: SearchHistoryItem[] = JSON.parse(savedHistory);
      setHistory(
        storedHistory.map((item) => {
          const board =
            boards.find((candidate) => candidate.id === item.boardId) ??
            boards.find((candidate) => candidate.name === item.boardName);

          return {
            ...item,
            boardId: item.boardId ?? board?.id,
            columnId:
              item.columnId ??
              board?.lists.find((column) => column.name === item.colName)?.id,
          };
        }),
      );
    }
    setHistoryLoaded(true);
  }, [boards]);

  useEffect(() => {
    if (!historyLoaded) return;
    localStorage.setItem("history", JSON.stringify(history));
  }, [history, historyLoaded]);

  const saveHistory = (nextHistory: SearchHistoryItem[]) => {
    localStorage.setItem("history", JSON.stringify(nextHistory));
    setHistory(nextHistory);
  };

  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return [];

    const results: SearchHistoryItem[] = [];

    boards?.forEach((board) => {
      if (board?.name?.toLowerCase().includes(query)) {
        results.push({ boardId: board.id, boardName: board.name });
        return;
      }

      board?.lists?.forEach((column) => {
        if (column?.name?.toLowerCase().includes(query)) {
          results.push({
            boardId: board.id,
            boardName: board.name,
            columnId: column.id,
            colName: column.name,
          });
          return;
        }

        column?.todos?.forEach((todo) => {
          if (todo?.text?.toLowerCase().includes(query)) {
            results.push({
              boardId: board.id,
              boardName: board.name,
              columnId: column.id,
              colName: column.name,
              todoName: todo.text,
            });
          }
        });
      });
    });

    return results;
  }, [boards, searchText]);

  const handleHistory = (newValue: SearchHistoryItem) => {
    const exists = history.some(
      (item) =>
        item.boardId === newValue.boardId &&
        (item.columnId ?? item.colName) ===
          (newValue.columnId ?? newValue.colName) &&
        item.todoName === newValue.todoName,
    );
    if (!exists) saveHistory([...history, newValue]);
  };

  const deleteHistory = (index: number) => {
    saveHistory(
      history.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const clearHistory = () => saveHistory([]);

  const query = searchText.trim();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col gap-6 px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8"
      >
        <section
          aria-label="Workspace search"
          className="rounded-2xl border border-white/40 bg-zinc-950/55 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-5"
        >
          <label
            htmlFor="workspace-search"
            className="mb-3 block text-sm font-medium text-zinc-200"
          >
            Search your workspace
          </label>
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <Input
              id="workspace-search"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              autoFocus
              placeholder="Try a board, column, or task name"
              className="h-12 rounded-xl border-white/40 bg-black/30 pl-12 pr-12 text-base text-white placeholder:text-zinc-500 focus-visible:border-sky-300 focus-visible:ring-sky-300/50"
            />
            {searchText && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchText("")}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
              >
                <CloseIcon fontSize="small" />
              </button>
            )}
          </div>
        </section>

        <div className="grid flex-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.85fr)]">
          <section
            aria-labelledby="search-results-title"
            className="flex h-full flex-col rounded-2xl border border-white/40 bg-zinc-950/40 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3
                  id="search-results-title"
                  className="text-lg font-semibold sm:text-xl"
                >
                  Results
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {query
                    ? `${filtered.length} ${
                        filtered.length === 1 ? "result" : "results"
                      }`
                    : "Matches from across your workspace"}
                </p>
              </div>
              {query && (
                <span className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
                  {filtered.length}
                </span>
              )}
            </div>

            {!query ? (
              <div className="flex min-h-60 flex-1 flex-col items-center justify-center rounded-xl border border-white/25 bg-gradient-to-br from-sky-300/[0.06] via-white/[0.02] to-transparent px-5 text-center">
                <span className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-sky-200/25 bg-sky-300/10 text-sky-200">
                  <SearchIcon />
                </span>
                <p className="font-medium text-white">
                  Your results will appear here
                </p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-400">
                  Enter a name above to find the board, column, or task you
                  need.
                </p>
              </div>
            ) : filtered.length > 0 ? (
              <ul className="space-y-2">
                {filtered.map((item) => {
                  const boardIndex = boards.findIndex(
                    (board) => board.id === item.boardId,
                  );
                  if (boardIndex < 0) return null;

                  const resultType = item.todoName
                    ? "Task"
                    : item.colName
                      ? "Column"
                      : "Board";

                  return (
                    <li
                      key={`${item.boardId}-${item.colName}-${item.todoName}`}
                    >
                      <Link
                        to={`/board/${boardIndex}`}
                        onClick={() => {
                          setSearchColumn(item.columnId);
                          handleHistory(item);
                        }}
                        className="group flex min-h-16 items-center gap-3 rounded-xl border border-white/30 bg-white/[0.04] px-4 py-3 transition hover:border-white/70 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:text-base">
                          <span className="truncate font-medium text-white">
                            {item.boardName}
                          </span>
                          {item.colName && (
                            <>
                              <ArrowForwardIosIcon
                                aria-hidden="true"
                                className="shrink-0 text-zinc-500"
                                sx={{ fontSize: 12 }}
                              />
                              <span className="truncate text-zinc-300">
                                {item.colName}
                              </span>
                            </>
                          )}
                          {item.todoName && (
                            <>
                              <ArrowForwardIosIcon
                                aria-hidden="true"
                                className="shrink-0 text-zinc-500"
                                sx={{ fontSize: 12 }}
                              />
                              <span className="truncate text-zinc-300">
                                {item.todoName}
                              </span>
                            </>
                          )}
                        </span>
                        <span className="shrink-0 rounded-full border border-white/25 bg-black/20 px-2.5 py-1 text-xs text-zinc-300">
                          {resultType}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                role="status"
                className="flex min-h-60 flex-1 flex-col items-center justify-center rounded-xl border border-white/25 bg-white/[0.02] px-5 text-center"
              >
                <span className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-zinc-400">
                  <SearchIcon />
                </span>
                <p className="font-medium text-zinc-200">No matches found</p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-400">
                  Try another name or a shorter search.
                </p>
              </div>
            )}
          </section>

          <SearchHistory
            history={history}
            handleHistory={handleHistory}
            deleteHistory={deleteHistory}
            clearHistory={clearHistory}
          />
        </div>
      </motion.main>
    </AnimatePresence>
  );
}
