import React, { useState, useEffect } from "react";
import ColumnList from "./columnList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QueueIcon from "@mui/icons-material/Queue";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
//framer motion
import { motion, AnimatePresence } from "framer-motion";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const header2 =
  "text-white ml-20 font-medium font-stretch-expanded flex items-center text-2xl transition-all";
const divHeader =
  "w-screen relative py-5 bg-neutral-900 text-white flex flex-row justify-between items-center";
const expandIcon = "scale-140 ml-2";
const setingIcon = "text-white scale-130 cursor-pointer";
const header1 =
  "text-3xl font-medium font-stretch-expanded mb-3 text-white mt-3";
const boardNameDiv = "flex flex-row items-center justify-between w-full";
const icons = "mr-2 scale-105";

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
  const settingOptions = [
    { label: "Account", icon: <PersonOutlineIcon className={icons} /> },
    { label: "Dashboard", icon: <DashboardIcon className={icons} /> },
    { label: "Help", icon: <HelpOutlineIcon className={icons} /> },
    { label: "Logout", icon: <LogoutIcon className={icons} /> },
  ];

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);

  const addBoard = () => {
    setBoards([...boards, { name: `Board ${boards.length + 1}`, lists: [] }]);
    setCurrentBoard(boards.length);
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
    <div className="bg-linear-65 from-indigo-900 to-rose-900 overflow-hidden h-screen">
      {more ? (
        <div className={` ${divHeader}`}>
          {/* board switcher */}
          <h2 className={` ${header2} flex-col mt-3`}>
            <button
              onClick={() => setMore((prev) => !prev)}
              className="cursor-pointer mb-3"
            >
              {boards[currentBoard].name}
              <ExpandLessIcon className={expandIcon} />
            </button>
            {boards.map((board, index) => (
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
                {/* list of board name */}
                <button
                  onClick={() => setCurrentBoard(index)}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-45 h-8 mt-1 font-semibold  text-base transition-all duration-300 flex justify-center items-center hover:scale-115 ${
                    index === currentBoard
                      ? "bg-zinc-100  text-black border-none rounded-sm"
                      : " hover:border-2 hover:rounded-sm border-b-2 border-white"
                  }`}
                >
                  <span className="ml-1 w-full">
                    {/* editing mode */}
                    {editingIndex === index ? (
                      <div className={boardNameDiv}>
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
                          className="text-base font-medium w-full font-sans focus:outline-none text-black underline px-2"
                        />
                      </div>
                    ) : (
                      // view mode
                      <div className={boardNameDiv}>
                        {hovered === index && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingIndex(index);
                              setEditingNaming(boards[index].name);
                            }}
                          >
                            <EditIcon className="scale-110 cursor-pointer ml-2" />
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
                            <DeleteForeverIcon className="scale-110 mr-2" />
                          </button>
                        )}
                      </div>
                    )}
                  </span>
                </button>
              </div>
            ))}
            {/* add another board */}
            <button
              onClick={addBoard}
              className="flex items-center py-1 hover:bg-white hover:text-black text-white active:scale-95 underline rounded-sm transition-all duration-300 mt-5 scale-115 w-40 justify-center cursor-pointer"
            >
              {/* Add a board */}
              <QueueIcon />
            </button>
          </h2>
          {/* description  */}
          <div className="flex flex-col text-center">
            <h1 className={header1}>My trello board</h1>
            <p className={`${textDec} w-100 italic font-medium text-lg`}>
              Trello is a web-based project management application that helps
              you organize work with boards, lists, and cards.
            </p>
          </div>
          {/* settings */}
          <div className="mr-20 flex items-center flex-col mt-3">
            <button onClick={() => setMore((prev) => !prev)}>
              <SettingsIcon className={` ${setingIcon} mb-3`} />
            </button>
            <ul className="flex items-start flex-col text-lg font-bold ">
              {settingOptions.map((option, idx) => (
                <li
                  key={idx}
                  className={`${textDec} hover:underline-offset-3 hover:underline mt-4 hover:scale-105 text-lg flex items-center cursor-not-allowed transition-all text-zinc-300 hover:text-white`}
                >
                  {option.icon}
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        // preview
        <div className={` ${divHeader}`}>
          <h2 className={` ${header2} flex-row hover:text-gray-300`}>
            <button
              onClick={() => setMore((prev) => !prev)}
              className="cursor-pointer"
            >
              {boards[currentBoard].name}
              <ExpandMoreIcon className={expandIcon} />
            </button>
          </h2>
          <h1 className={header1}>My trello board</h1>
          <button onClick={() => setMore((prev) => !prev)}>
            <SettingsIcon className={` ${setingIcon} mr-20`} />
          </button>
        </div>
      )}

      {/* Board Content */}
      <div className="overflow-x-auto h-screen" onClick={() => setMore(false)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBoard ? boards[currentBoard].name : null}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
