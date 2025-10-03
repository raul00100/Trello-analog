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
import {
  useLocation,
  useMatch,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const divHeader =
  "w-screen relative text-white flex flex-row justify-between items-start pt-5";
const expandIcon = "scale-140 mr-2";
const boardNameDiv = "flex flex-row items-center justify-between w-full";
const icons = "mr-2 scale-105";
const headerStyle =
  " font-stretch-expanded transition-all text-white font-medium text-xl hover:text-gray-300 ml-30";
const buttonHeader = "flex items-center cursor-pointer ";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};

export type GeneralProp = {
  boards: BoardTypeProps[];
  setBoards: React.Dispatch<React.SetStateAction<BoardTypeProps[]>>;
  addBoard: () => void;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavPanel({
  boards,
  setBoards,
  addBoard,
  more,
  setMore,
}: GeneralProp) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const location = useLocation();
  const isBoard = !!useMatch("/board/:id");
  const params = useParams();
  const savedBoardId = localStorage.getItem("boardId");
  const homeBoardId = Number(savedBoardId);
  const boardId =
    isBoard && params.id && !isNaN(Number(params.id))
      ? Number(params.id)
      : homeBoardId;
  const navigate = useNavigate();
  const settingOptions = [
    {
      label: "Home",
      icon: <HomeIcon className={icons} />,
      path: `/board/${homeBoardId}`,
    },
    {
      label: "Theme",
      icon: <FormatPaintIcon className={icons} />,
      path: "/theme",
    },
    {
      label: "Search",
      icon: <SearchIcon className={icons} />,
      path: "/search",
    },
  ];

  // animation for a folding and unfolding panel
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
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
    if (isBoard && params.id && !isNaN(Number(params.id))) {
      localStorage.setItem("boardId", boardId.toString());
    }
  }, [isBoard, params.id, boardId]);

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
  };

  return (
    <div>
      {/* nav panel */}
      <header
        ref={panelRef}
        className="w-full bg-white/20 backdrop-blur-md border-b border-white h-65"
      >
        {/* undisclosed panel  */}
        <div className={divHeader}>
          {isBoard ? (
            <h2 className={`${headerStyle}`}>
              <button
                onClick={() => setMore((prev) => !prev)}
                className={buttonHeader}
              >
                {more ? (
                  <ExpandLessIcon className={expandIcon} />
                ) : (
                  <ExpandMoreIcon className={expandIcon} />
                )}
                <span className="inline-block truncate max-w-60">
                  {boards[boardId] ? boards[boardId].name : "No board"}
                </span>
              </button>
            </h2>
          ) : (
            <h2 className={`${headerStyle}`}>
              <Link to={`/board/${homeBoardId}`}>
                <button className={buttonHeader}>
                  <ArrowBackIosIcon />
                  Go Home
                </button>
              </Link>
            </h2>
          )}
          <h1 className="text-2xl font-medium font-stretch-expanded text-white absolute left-1/2 -translate-x-1/8">
            My trello board
          </h1>
          <button onClick={() => setMore((prev) => !prev)} className="mr-30">
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
          {isBoard ? (
            <nav className="flex flex-col items-center ml-25 overflow-y-auto max-h-50 w-55">
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
                    onClick={() => {
                      navigate(`/board/${index}`);
                    }}
                    onMouseEnter={() => setHovered(index)}
                    onMouseLeave={() => setHovered(null)}
                    className={`w-45 h-8 mt-1 font-semibold text-base transition-all duration-300 flex justify-center items-center hover:scale-115 hover:rounded font-stretch-semi-expanded cursor-pointer ${
                      index === boardId
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
                              index === boardId ? "text-black" : "text-white"
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
          <div className="flex flex-col text-center absolute left-1/2 -translate-x-1/3 mt-2">
            <p className={`${textDec} w-100 font-mono font-medium text-lg`}>
              Trello is a web-based project management application that helps
              you organize work
            </p>
          </div>

          {/* settings list - coming soon... */}
          <nav className="flex flex-col mr-20">
            <ul className="flex items-start flex-col text-lg font-bold gap-4.5 mt-2">
              {settingOptions.map((option, idx) => {
                return (
                  <li
                    key={idx}
                    className={`font-sans font-stretch-semi-expanded antialiased text-lg transition-all cursor-pointer 
                      ${
                        location.pathname === option.path
                          ? " underline scale-105 text-white underline-offset-3 hover:animate-pulse"
                          : " hover:underline hover:scale-105 text-zinc-300 hover:text-white hover:underline-offset-3"
                      }
                        `}
                  >
                    <Link to={option.path}>
                      <span className="flex items-center ">
                        {option.icon}
                        {option.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
