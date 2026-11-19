"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { useSharedProvider } from "../shared/context/useSharedProvider";
import { Button } from "../shared/components/ui/button";
import BoardEditModal from "../features/boardContent/components/Modals/BoardEditModal";
import type { Board } from "../features/boardContent/model/boardTypes";

export default function HomePage() {
  const { boards, addBoard, setBoards } = useSharedProvider();
  const navigate = useNavigate();
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [newBoardDraft, setNewBoardDraft] = useState<Board | null>(null);
  const editingBoard = boards.find((board) => board.id === editingBoardId);
  const editingBoardIndex = boards.findIndex(
    (board) => board.id === editingBoardId,
  );
  const modalBoard = newBoardDraft ?? editingBoard;

  const handleAddBoard = () => {
    setEditingBoardId(null);
    setNewBoardDraft({
      id: crypto.randomUUID(),
      name: "",
      lists: [],
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col px-5 pt-8 pb-30 text-white">
      <h2 className="mb-6 text-2xl font-semibold">Boards</h2>

      {boards.length > 0 ? (
        <ul className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board, index) => (
            <li key={board.id}>
              <div className="relative flex h-32 overflow-hidden rounded-lg border border-white/40 bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:border-white hover:bg-white/20">
                <Link
                  to={`/board/${index}`}
                  className="flex min-w-0 flex-1 flex-col justify-between p-5 pr-14 backdrop-blur-md"
                >
                  <span className="truncate text-xl font-semibold">
                    {board.name || "Untitled board"}
                  </span>
                  <span className="text-sm text-zinc-300">
                    {board.lists.length}{" "}
                    {board.lists.length === 1 ? "column" : "columns"}
                  </span>
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${board.name || "untitled board"}`}
                  onClick={() => setEditingBoardId(board.id)}
                  className="absolute right-3 top-3 text-white hover:bg-white/20 hover:text-white scale-90"
                >
                  <EditIcon />
                </Button>
              </div>
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

      {modalBoard && (newBoardDraft !== null || editingBoardIndex !== -1) && (
        <BoardEditModal
          key={modalBoard.id}
          board={modalBoard}
          isCreating={newBoardDraft !== null}
          onSave={(name) => {
            if (newBoardDraft) {
              addBoard(name);
              setNewBoardDraft(null);
              return;
            }
            if (!editingBoard) return;
            setBoards((currentBoards) =>
              currentBoards.map((board) =>
                board.id === editingBoard.id ? { ...board, name } : board,
              ),
            );
            setEditingBoardId(null);
          }}
          onDelete={() => {
            if (!editingBoard) return;
            setBoards((currentBoards) =>
              currentBoards.filter((board) => board.id !== editingBoard.id),
            );
            setEditingBoardId(null);
          }}
          onCancel={() => {
            setEditingBoardId(null);
            setNewBoardDraft(null);
          }}
          onOpenColumn={(columnId) => {
            if (!editingBoard || editingBoardIndex === -1) return;
            setEditingBoardId(null);
            navigate(`/board/${editingBoardIndex}`, {
              state: { openColumnId: columnId },
            });
          }}
        />
      )}
    </main>
  );
}
