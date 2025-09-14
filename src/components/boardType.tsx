import React, { useState, useEffect } from "react";
import ColumnList from "./columnList";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ClearIcon from "@mui/icons-material/Clear";

type Todo = { text: string; done: boolean };
type ColumnCard = { name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};

export default function BoardType() {
  const [boards, setBoards] = useState<BoardTypeProps[]>(() => {
    const savedBoard = localStorage.getItem("board");
    return savedBoard ? JSON.parse(savedBoard) : [];
  });
  const [currentBoard, setCurrentBoard] = useState(0);
  const [more, setMore] = useState(false);

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);

  const addBoard = () => {
    setBoards([...boards, { name: `Board ${boards.length + 1}`, lists: [] }]);
    setCurrentBoard(boards.length); // switch to new board
  };

  const deleteBoard = (index: number) => {
    const newBoards = boards.filter((_, i) => i !== index);
    setBoards(newBoards);
    if (currentBoard >= newBoards.length) {
      setCurrentBoard(Math.max(0, newBoards.length - 1));
    }
  };

  if (boards.length === 0) {
    return (
      <div className="bg-linear-65 bg-[#19183B] min-h-screen flex flex-col items-center justify-center">
        <button
          onClick={addBoard}
          className="flex flex-col items-center bg-gray-600 text-white px-5 py-2 rounded-lg"
        >
          <AddCircleIcon />
          <span className="mt-2">Add your first board</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-65 bg-[#19183B] min-h-screen">
      {/* Board Switcher */}
      <div className="w-screen relative py-5 bg-gray-600 flex flex-row justify-between items-center">
        <h1 className="text-2xl ml-20 text-white font-medium font-stretch-expanded">
          My trello board
        </h1>
        <h2 className="text-xl text-white mr-20 font-medium font-stretch-expanded flex flex-col">
          <div className="flex flex-row">
            {boards[currentBoard].name}
            <button
              onClick={() => setMore((prev) => !prev)}
              className="cursor-pointer scale-120 ml-2"
            >
              {more ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          {more
            ? boards.map((board, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBoard(index)}
                  className={`px-4 py-1 mt-2 rounded font-semibold text-white text-lg transition-all duration-200${
                    index === currentBoard
                      ? "underline underline-offset-4 bg-gray-900"
                      : "hover:bg-gray-600"
                  }`}
                >
                  {board.name}
                  <button
                    className="ml-3 text-red-500 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBoard(index);
                    }}
                  >
                    <ClearIcon />
                  </button>
                </button>
              ))
            : null}
          {more ? (
            <button
              onClick={addBoard}
              className="ml-4 flex items-center px-3 py-1 bg-blue-800 text-white active:bg-blue-700 rounded-md hover:scale-105 transition-all mt-2"
            >
              <AddCircleIcon />
              <span className="ml-1 text-base">Add board</span>
            </button>
          ) : null}
        </h2>
      </div>
      {/* Board Content */}
      <div className="overflow-x-auto h-screen">
        <ColumnList
          columns={boards[currentBoard].lists}
          setColumns={(newColumns) => {
            setBoards((boards) =>
              boards.map((b, index) =>
                index === currentBoard
                  ? {
                      ...b,
                      lists:
                        typeof newColumns === "function"
                          ? newColumns(b.lists)
                          : newColumns,
                    }
                  : b
              )
            );
          }}
        />
      </div>
    </div>
  );
}
