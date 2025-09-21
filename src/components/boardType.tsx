import React, { useState, useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const divHeader =
  "w-screen relative text-white flex flex-row mt-5 justify-between";
const expandIcon = "scale-140 ml-2";
const boardNameDiv = "flex flex-row items-center justify-between w-full";
const icons = "mr-2 scale-105";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};

export default function BoardType() {
  const [boards, setBoards] = useState<BoardTypeProps[]>(() => {
    const savedBoard = localStorage.getItem("board");
    return savedBoard ? JSON.parse(savedBoard) : [];
  });
  const [currentBoard, setCurrentBoard] = useState(() => {
    const savedCurrentBoard = localStorage.getItem("current");
    return savedCurrentBoard ? JSON.parse(savedCurrentBoard) : 0;
  });
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

  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.set(panelRef.current, { overflow: "hidden" });

    if (tlRef.current) tlRef.current.kill();

    if (more) {
      tlRef.current = gsap.to(panelRef.current, {
        height: 300,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      tlRef.current = gsap.to(panelRef.current, {
        height: 80,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [more]);

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);
  useEffect(() => {
    localStorage.setItem("current", JSON.stringify(currentBoard));
  });

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
    <div className="overflow-hidden h-screen">
      {/* nav panel */}
      <div
        ref={panelRef}
        className="w-full bg-white/20 backdrop-blur-md border-b border-white"
        onClick={() => setEditingIndex(null)}
      >
        {/* undisclosed panel  */}
        <div className={`${divHeader}`}>
          <h2
            className={`text-white font-medium font-stretch-expanded flex items-center text-2xl transition-all ml-30 flex-row hover:text-gray-300`}
          >
            <button
              onClick={() => setMore((prev) => !prev)}
              className="cursor-pointer"
            >
              {boards[currentBoard].name}
              {more ? (
                <ExpandLessIcon className={expandIcon} />
              ) : (
                <ExpandMoreIcon className={expandIcon} />
              )}
            </button>
          </h2>
          <h1 className="text-3xl font-medium font-stretch-expanded text-white">
            My trello board
          </h1>
          <button onClick={() => setMore((prev) => !prev)} className={`mr-30`}>
            <SettingsIcon className="text-white scale-130 cursor-pointer" />
          </button>
        </div>

        {/* revealed panel */}
        <div
          className={` ${divHeader} transition-opacity duration-300 justify-between ${
            more ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* board switcher */}
          <div className="flex flex-col items-center ml-17 overflow-y-auto max-h-50 w-55">
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
                  className={`w-45 h-8 mt-1 font-semibold text-base transition-all duration-300 flex justify-center items-center hover:scale-115 hover:rounded ${
                    index === currentBoard
                      ? "bg-zinc-100 text-black border-none rounded"
                      : "hover:border-2 border-b-2 border-white"
                  }`}
                >
                  <span className="ml-1 w-full">
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
                          className={`text-base font-medium w-full font-sans focus:outline-none px-2 ${
                            index === currentBoard ? "text-black" : "text-white"
                          }`}
                        />
                      </div>
                    ) : (
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
              className="flex items-center py-1 hover:bg-white hover:text-black text-white active:scale-95 underline rounded transition-all duration-300 mt-5 w-40 justify-center scale-110 cursor-pointer"
            >
              <QueueIcon />
            </button>
          </div>

          {/* description */}
          <div className="flex flex-col text-center">
            <p className={`${textDec} w-100 italic font-medium text-lg`}>
              Trello is a web-based project management application that helps
              you organize work with boards, lists, and cards.
            </p>
          </div>

          {/* settings list */}
          <div className="flex flex-col mr-15 pb-7">
            <ul className="flex items-start flex-col text-lg font-bold gap-4">
              {settingOptions.map((option, idx) => (
                <li
                  key={idx}
                  className={`${textDec} hover:underline-offset-3 hover:underline hover:scale-105 text-lg flex items-center cursor-not-allowed transition-all text-zinc-300 hover:text-white`}
                >
                  {option.icon}
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div
        className="overflow-x-auto h-screen"
        onClick={() => {
          setEditingIndex(null);
          setMore(false);
        }}
      >
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
