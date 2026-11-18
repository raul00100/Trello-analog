"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSharedProvider } from "@/shared/context/useSharedProvider";
import { Input } from "@/shared/components/ui/input";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import QueueIcon from "@mui/icons-material/Queue";
import EditIcon from "@mui/icons-material/Edit";

type BoardSwitcherProps = {
  boardId: number;
};

const boardNameDiv = "flex flex-row items-center justify-between w-full ";

export default function BoardSwitcher({ boardId }: BoardSwitcherProps) {
  const { boards, addBoard, setBoards } = useSharedProvider();
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const navigate = useNavigate();

  const handleAddBoard = () => {
    const newBoardId = addBoard();
    if (boards.length > 0) {
      setEditingBoardId(newBoardId);
      setEditingNaming(`Board ${boards.length + 1}`);
    }
  };

  const deleteBoard = (id: string) => {
    setBoards((currentBoards) =>
      currentBoards.filter((board) => board.id !== id),
    );
  };

  return (
    <nav className="flex flex-col items-center lg:ml-25 overflow-y-auto lg:max-h-50 max-h-37 lg:w-55 ml-3 mt-0">
      {boards.map((board, index) => (
        <div key={board.id} className="relative w-full flex justify-center">
          <div className="absolute inset-0 flex justify-between items-center px-5 pointer-events-none">
            <button className="opacity-0">
              <EditIcon />
            </button>
            <button className="opacity-0">
              <DeleteForeverIcon />
            </button>
          </div>
          <button
            onClick={() => {
              navigate(`/board/${index}`);
            }}
            onMouseEnter={() => setHoveredBoardId(board.id)}
            onMouseLeave={() => setHoveredBoardId(null)}
            className={`lg:w-45 lg:h-8 w-35 h-6 mt-1.5 font-semibold lg:text-base text-xs transition-all duration-300 flex justify-center items-center hover:scale-115 hover:rounded font-stretch-semi-expanded cursor-pointer ${
              index === boardId
                ? "bg-zinc-100 text-black border-none rounded"
                : "hover:border-2 border-b-2 border-white"
            }`}
          >
            <span className="ml-1 w-full">
              {editingBoardId === board.id ? (
                <div className={boardNameDiv}>
                  <Input
                    autoFocus
                    value={editingNaming}
                    onChange={(event) => setEditingNaming(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        event.stopPropagation();
                        if (editingNaming.trim() === "") return;
                        setBoards((currentBoards) =>
                          currentBoards.map((currentBoard) =>
                            currentBoard.id === board.id
                              ? { ...currentBoard, name: editingNaming.trim() }
                              : currentBoard,
                          ),
                        );
                        setEditingBoardId(null);
                      }
                    }}
                    onBlur={() => {
                      if (editingNaming.trim() === "") return;
                      setBoards((currentBoards) =>
                        currentBoards.map((currentBoard) =>
                          currentBoard.id === board.id
                            ? { ...currentBoard, name: editingNaming.trim() }
                            : currentBoard,
                        ),
                      );
                      setEditingBoardId(null);
                    }}
                    className={`h-auto w-auto rounded-none border-0 bg-transparent px-2 py-0 text-base font-medium shadow-none focus:outline-none focus-visible:ring-0${
                      index === boardId ? "text-black" : "text-white"
                    }`}
                  />
                </div>
              ) : (
                <div className={boardNameDiv}>
                  {hoveredBoardId === board.id && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoardId(board.id);
                        setEditingNaming(board.name);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setEditingBoardId(board.id);
                          setEditingNaming(board.name);
                        }
                      }}
                      className="inline-flex items-center lg:scale-105 scale-90 cursor-pointer ml-2 focus:outline-none"
                    >
                      <EditIcon />
                    </span>
                  )}
                  <span className="truncate flex-1 mx-3 text-base">
                    {board.name}
                  </span>
                  {hoveredBoardId === board.id && (
                    <span
                      role="button"
                      tabIndex={0}
                      className="hover:text-red-500 hover:underline cursor-pointer transition-all duration-300 inline-flex items-center focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard(board.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          deleteBoard(board.id);
                        }
                      }}
                    >
                      <DeleteForeverIcon className="lg:scale-105 scale-90 mr-2" />
                    </span>
                  )}
                </div>
              )}
            </span>
          </button>
        </div>
      ))}
      <Link to={`/board/${boards.length}`}>
        <button
          onClick={handleAddBoard}
          className="flex items-center py-1 mb-5 hover:bg-white hover:text-black text-white active:scale-95 underline rounded transition-all duration-300 mt-5 w-41.5 justify-center lg:scale-110 scale-95 cursor-pointer"
        >
          <QueueIcon />
        </button>
      </Link>
    </nav>
  );
}
