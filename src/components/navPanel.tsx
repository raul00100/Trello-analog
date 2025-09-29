import React, { useState, useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import QueueIcon from "@mui/icons-material/Queue";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import gsap from "gsap";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SharedInput from "../shared/sharedInput";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const divHeader =
  "w-screen relative text-white flex flex-row justify-between items-start pt-5";
const expandIcon = "scale-140 ml-2";
const boardNameDiv = "flex flex-row items-center justify-between w-full";
const icons = "mr-2 scale-105";
const settingStyle =
  "text-lg flex items-center transition-all hover:underline hover:scale-110 text-zinc-300 hover:text-white hover:underline-offset-3";
const buttonStyle = "cursor-pointer";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};
type GeneralProp = {
  boards: BoardTypeProps[];
  setBoards: React.Dispatch<React.SetStateAction<BoardTypeProps[]>>;
  currentBoard: number;
  setCurrentBoard: React.Dispatch<React.SetStateAction<number>>;
  addBoard: () => void;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavPanel({
  boards,
  setBoards,
  currentBoard,
  setCurrentBoard,
  addBoard,
  more,
  setMore,
}: GeneralProp) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const [setting, setSetting] = useState<string | null>(() => {
    const savedSetting = localStorage.getItem("setting");
    return savedSetting ? JSON.parse(savedSetting) : "Home";
  });

  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);

  // animation for a folding and unfolding panel
  useEffect(() => {
    if (!panelRef.current) return;

    gsap.set(panelRef.current, { overflow: "hidden" });

    if (tlRef.current) tlRef.current.kill();

    if (more) {
      tlRef.current = gsap.to(panelRef.current, {
        height: 270,
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
  useEffect(() => {
    localStorage.setItem("setting", JSON.stringify(setting));
  });

  const handleAddBoard = () => {
    addBoard();

    if (boards.length > 0) {
      setEditingIndex(boards.length);
      setEditingNaming(`Board ${boards.length + 1}`);
    }
  };

  const deleteBoard = (index: number) => {
    const newBoards = boards.filter((_, i) => i !== index);
    setBoards(newBoards);
    if (currentBoard >= newBoards.length) {
      setCurrentBoard(Math.max(0, newBoards.length - 1));
    }
  };

  return (
    <div>
      {/* nav panel */}
      <header
        ref={panelRef}
        className="w-full bg-white/20 backdrop-blur-md border-b border-white h-65"
      >
        {/* undisclosed panel  */}
        <div className={`${divHeader}`}>
          {setting === "Home" ? (
            <h2
              className={`text-white font-medium font-stretch-expanded flex items-center text-xl transition-all ml-30 flex-row hover:text-gray-300`}
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
          ) : (
            <h2
              className={`text-white font-medium font-stretch-expanded text-xl transition-all ml-30 flex-row hover:text-gray-300`}
            >
              <Link to="/">
                <button
                  onClick={() => setSetting("Home")}
                  className="cursor-pointer flex items-center"
                >
                  <ArrowBackIosIcon />
                  Go Home
                </button>
              </Link>
            </h2>
          )}
          <h1 className="text-2xl font-medium font-stretch-expanded text-white">
            My trello board
          </h1>
          <button onClick={() => setMore((prev) => !prev)} className={`mr-30`}>
            <SettingsIcon
              className={`text-white scale-130 cursor-pointer ${
                more ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "5s" }}
            />
          </button>
        </div>

        {/* revealed panel */}
        <div
          className={` ${divHeader} transition-opacity duration-300 justify-between ${
            more ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* board switcher */}
          {setting === "Home" ? (
            <nav className="flex flex-col items-center ml-17 overflow-y-auto max-h-50 w-55">
              {boards.map((board, index) => (
                <div
                  key={index}
                  className="relative w-full flex justify-center mt-2"
                >
                  {/* reserved space for buttons */}
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
                    className={`w-45 h-8 mt-1 font-semibold text-base transition-all duration-300 flex justify-center items-center hover:scale-115 hover:rounded font-stretch-semi-expanded ${
                      index === currentBoard
                        ? "bg-zinc-100 text-black border-none rounded"
                        : "hover:border-2 border-b-2 border-white"
                    }`}
                  >
                    <span className="ml-1 w-full">
                      {editingIndex === index ? (
                        <div className={boardNameDiv}>
                          <SharedInput
                            value={editingNaming}
                            onChange={setEditingNaming}
                            className={`text-base font-medium w-full font-sans focus:outline-none px-2${
                              index === currentBoard
                                ? "text-black"
                                : "text-white"
                            }`}
                            onSubmit={(newValue) => {
                              const updatedBoards = [...boards];
                              updatedBoards[index].name = newValue;
                              setBoards(updatedBoards);
                              setEditingIndex(null);
                            }}
                            onFocus={() => {}}
                          />
                        </div>
                      ) : (
                        <div className={boardNameDiv}>
                          {hovered === index && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingIndex(index);
                                setEditingNaming(boards[index].name);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  setEditingIndex(index);
                                  setEditingNaming(boards[index].name);
                                }
                              }}
                              className="inline-flex items-center scale-105 cursor-pointer ml-2 focus:outline-none"
                            >
                              <EditIcon />
                            </span>
                          )}
                          <span className="truncate flex-1 mx-3">
                            {board.name}
                          </span>
                          {hovered === index && (
                            <span
                              role="button"
                              tabIndex={0}
                              className="hover:text-red-500 hover:underline cursor-pointer transition-all duration-300 inline-flex items-center focus:outline-none"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBoard(index);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  deleteBoard(index);
                                }
                              }}
                            >
                              <DeleteForeverIcon className="scale-105 mr-2" />
                            </span>
                          )}
                        </div>
                      )}
                    </span>
                  </button>
                </div>
              ))}
              {/* add another board */}
              <button
                onClick={handleAddBoard}
                className="flex items-center py-1 mb-5 hover:bg-white hover:text-black text-white active:scale-95 underline rounded transition-all duration-300 mt-5 w-41.5 justify-center scale-110 cursor-pointer"
              >
                <QueueIcon />
              </button>
            </nav>
          ) : (
            <div className="flex flex-col items-center ml-17 overflow-y-auto max-h-50 w-55" />
          )}

          {/* description */}
          <div className="flex flex-col text-center">
            <p className={`${textDec} w-100 font-mono font-medium text-lg`}>
              Trello is a web-based project management application that helps
              you organize work
            </p>
          </div>

          {/* settings list - coming soon... */}
          <nav className="flex flex-col mr-20">
            <ul className="flex items-start flex-col text-lg font-bold gap-4.5">
              <li className={`${textDec} ${settingStyle}`}>
                <Link to="/">
                  <button
                    onClick={() => setSetting("Home")}
                    className={buttonStyle}
                  >
                    <HomeIcon className={icons} />
                    Home
                  </button>
                </Link>
              </li>
              <li className={`${textDec} ${settingStyle}`}>
                <Link to="/theme">
                  <button
                    onClick={() => setSetting("Theme")}
                    className={buttonStyle}
                  >
                    <FormatPaintIcon className={icons} /> Theme
                  </button>
                </Link>
              </li>
              <li className={`${textDec} ${settingStyle}`}>
                <Link to="/search">
                  <button
                    onClick={() => setSetting("Search")}
                    className={buttonStyle}
                  >
                    <SearchIcon className={icons} /> Search
                  </button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
