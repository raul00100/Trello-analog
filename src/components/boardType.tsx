import React, { useState, useEffect } from "react";
import ColumnList from "./columnList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QueueIcon from "@mui/icons-material/Queue";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-gray-300 antialiased";

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
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const settingOptions = ["Profile", "Account", "Dashboard", "Logout", "Help"];

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
          <QueueIcon />
          <span className="mt-2">Add your first board</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-linear-65 bg-[#19183B] overflow-hidden h-screen">
      {/* header */}
      <div className="w-screen relative py-5 bg-gray-600 flex flex-row justify-between items-center">
        {/* board switcher */}
        <h2 className="text-white ml-20 font-medium font-stretch-expanded flex flex-col items-center mt-3">
          <div className="flex flex-row">
            <button
              onClick={() => setMore((prev) => !prev)}
              className="cursor-pointer scale-140 mb-3"
            >
              <span className="ml-2 text-base">
                {" "}
                {boards[currentBoard].name}{" "}
              </span>
              {more ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          {more
            ? boards.map((board, index) => (
                <div
                  key={index}
                  className="relative w-full flex justify-center mt-2"
                >
                  {/* reserv space for buttons */}
                  <div className="absolute inset-0 flex justify-between items-center px-5 pointer-events-none">
                    <button className="opacity-0">
                      <EditIcon />
                    </button>
                    <button className="opacity-0">
                      <DeleteForeverIcon />
                    </button>
                  </div>

                  <button
                    onClick={() => setCurrentBoard(index)}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-50 h-11 rounded-sm font-semibold text-white text-base transition-all duration-300 flex justify-center items-center ${
                      index === currentBoard ? "bg-gray-950" : ""
                    } ${hovered === index ? "scale-115 bg-gray-700" : ""}`}
                  >
                    <span className="ml-1 w-full">
                      {/* editing mode */}
                      {editingIndex === index ? (
                        <div className="flex flex-row items-center justify-between w-full">
                          <input
                            ref={(el) => {
                              if (el) el.focus();
                            }}
                            value={editingNaming}
                            onChange={(e) => setEditingNaming(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (editingNaming.trim() === "") return;
                                const updatedCards = [...boards];
                                updatedCards[index].name = editingNaming;
                                setBoards(updatedCards);
                                setEditingIndex(null);
                              }
                            }}
                            className="text-lg font-medium w-full font-sans focus:outline-none text-zinc-300 underline px-2"
                          />
                        </div>
                      ) : (
                        // view mode
                        <div className="flex flex-row items-center justify-between w-full">
                          {hovered === index && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIndex(index);
                                setEditingNaming(boards[index].name);
                              }}
                            >
                              <EditIcon className="scale-120 cursor-pointer ml-2" />
                            </button>
                          )}
                          <span className="truncate flex-1 mx-3">
                            {board.name}
                          </span>
                          {hovered === index && (
                            <button
                              className="hover:text-red-500 hover:underline cursor-pointer transition-all duration-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBoard(index);
                              }}
                            >
                              <DeleteForeverIcon className="scale-120 mr-2" />
                            </button>
                          )}
                        </div>
                      )}
                    </span>
                  </button>
                </div>
              ))
            : null}

          {more ? (
            <button
              onClick={addBoard}
              className="flex items-center px-3 py-1.5 hover:bg-blue-800 text-white active:bg-blue-700 underline rounded-md hover:scale-110 transition-all mt-5"
            >
              <QueueIcon />
              <span className="ml-1 text-lg">Add board</span>
            </button>
          ) : null}
        </h2>
        {/* namig */}
        <div className="flex flex-col text-center">
          <h1 className="text-2xl font-medium font-stretch-expanded mb-3 text-white mt-3">
            My trello board
          </h1>
          {more ? (
            <p className={`${textDec} w-100 italic font-medium text-lg`}>
              Trello is a web-based project management application that helps
              you organize work with boards, lists, and cards.
            </p>
          ) : null}
        </div>
        {/* setitngs */}
        <div className="mr-20 flex items-center flex-col mt-3">
          <button onClick={() => setMore((prev) => !prev)}>
            <SettingsIcon className="text-white scale-130 cursor-pointer mb-3" />
          </button>
          {more ? (
            <ul className="flex items-center flex-col text-lg font-bold ">
              {settingOptions.map((option, idx) => (
                <li
                  key={idx}
                  className={`${textDec} hover:underline-offset-3 hover:underline mt-1.5 hover:scale-105 cursor-not-allowed`}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
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
