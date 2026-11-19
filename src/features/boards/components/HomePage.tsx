"use client";

import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

import { useSharedProvider } from "../../../shared/context/useSharedProvider";

export default function HomePage() {
  const { boards, addBoard } = useSharedProvider();

  const handleAddBoard = () => {
    addBoard();
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-30 text-white">
      <h2 className="mb-6 text-2xl font-semibold">Boards</h2>

      {boards.length > 0 ? (
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, index) => (
            <li key={board.id}>
              <Link
                to={`/board/${index}`}
                className="flex h-32 flex-col justify-between rounded-lg border border-white/40 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-white hover:bg-white/20"
              >
                <span className="truncate text-xl font-semibold">
                  {board.name || "Untitled board"}
                </span>
                <span className="text-sm text-zinc-300">
                  {board.lists.length}{" "}
                  {board.lists.length === 1 ? "column" : "columns"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-300">No boards available.</p>
      )}

      <button
        type="button"
        onClick={handleAddBoard}
        className="mt-6 flex h-12 w-45 items-center justify-center gap-2 rounded-lg border border-dashed border-white/50 bg-white/10 text-white transition-all duration-300 hover:border-white hover:bg-white/20 "
      >
        <AddIcon />
        Add board
      </button>
    </main>
  );
}
