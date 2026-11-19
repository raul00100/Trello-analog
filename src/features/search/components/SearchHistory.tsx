"use client";

import { Link } from "react-router-dom";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import type { SearchHistoryItem } from "../model/searchTypes";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import HistoryIcon from "@mui/icons-material/History";

type HistoryProps = {
  history: SearchHistoryItem[];
  handleHistory: (newValue: SearchHistoryItem) => void;
  deleteHistory: (index: number) => void;
  clearHistory: () => void;
};

export default function SearchHistory({
  history,
  handleHistory,
  deleteHistory,
  clearHistory,
}: HistoryProps) {
  const { boards, setSearchColumn } = useSharedProvider();

  return (
    <section
      aria-labelledby="search-history-title"
      className="flex h-full flex-col rounded-2xl border border-white/40 bg-zinc-950/40 p-4 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 id="search-history-title" className="text-lg font-semibold">
            Recent searches
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            {history.length === 0
              ? "Your opened results will appear here"
              : `${history.length} ${
                  history.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex min-h-60 flex-1 flex-col items-center justify-center rounded-xl border border-white/25 bg-gradient-to-br from-white/[0.03] to-transparent px-4 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-zinc-400">
            <HistoryIcon />
          </span>
          <p className="text-sm text-zinc-400">
            Open a search result to save it here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {history.map((item, index) => {
            const boardIndex = boards.findIndex(
              (board) => board.id === item.boardId,
            );
            const board = boardIndex >= 0 ? boards[boardIndex] : undefined;
            const column = item.colName
              ? board?.lists.find((list) =>
                  item.columnId
                    ? list.id === item.columnId
                    : list.name === item.colName,
                )
              : undefined;
            const isValid =
              !!board &&
              (!item.colName || !!column) &&
              (!item.todoName ||
                !!column?.todos.some((todo) => todo.text === item.todoName));
            const itemLabel = [
              item.boardName,
              item.colName,
              item.todoName,
            ]
              .filter(Boolean)
              .join(" / ");

            return (
              <li
                key={`${item.boardId}-${item.colName}-${item.todoName}-${index}`}
                className="group flex items-center gap-2"
              >
                {isValid ? (
                  <Link
                    to={`/board/${boardIndex}`}
                    onClick={() => {
                      setSearchColumn(column?.id);
                      handleHistory(item);
                    }}
                    title={itemLabel}
                    className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/30 bg-white/[0.04] px-3 text-sm text-zinc-200 transition hover:border-white/70 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"
                  >
                    <HistoryIcon
                      aria-hidden="true"
                      className="shrink-0 text-zinc-500"
                      fontSize="small"
                    />
                    <span className="min-w-0 flex-1 truncate">{itemLabel}</span>
                    <ArrowForwardIosIcon
                      aria-hidden="true"
                      className="shrink-0 text-zinc-500"
                      sx={{ fontSize: 12 }}
                    />
                  </Link>
                ) : (
                  <div
                    title={`${itemLabel} — no longer available`}
                    className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/20 bg-white/[0.02] px-3 text-sm text-zinc-500"
                  >
                    <DoNotDisturbIcon
                      aria-hidden="true"
                      className="shrink-0"
                      fontSize="small"
                    />
                    <span className="min-w-0 flex-1 truncate">{itemLabel}</span>
                    <span className="hidden shrink-0 text-xs sm:inline">
                      Unavailable
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${itemLabel} from recent searches`}
                  onClick={() => deleteHistory(index)}
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 opacity-70 transition hover:bg-red-400/10 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
