import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSharedProvider } from "../../shared/context/useSharedProvider";
import SharedInput from "../../shared/sharedInput";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import QueueIcon from "@mui/icons-material/Queue";
import EditIcon from "@mui/icons-material/Edit";

type SwitcherProps = {
  boardId: number;
};

const boardNameDiv = "flex flex-row items-center justify-between w-full ";

export default function Switcher({ boardId }: SwitcherProps) {
  const { boards, addBoard, setBoards } = useSharedProvider();
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const navigate = useNavigate();

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
    <nav className="flex flex-col items-center lg:ml-25 overflow-y-auto lg:max-h-50 max-h-37 lg:w-55 ml-3">
      {boards.map((board, index) => (
        <div key={index} className="relative w-full flex justify-center mt-2">
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
            className={`lg:w-45 lg:h-8 w-35 h-6 mt-1.5 font-semibold lg:text-base text-xs transition-all duration-300 flex justify-center items-center hover:scale-115 hover:rounded font-stretch-semi-expanded cursor-pointer ${
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
                      className="inline-flex items-center lg:scale-105 scale-90 cursor-pointer ml-2 focus:outline-none"
                    >
                      <EditIcon />
                    </span>
                  )}
                  <span className="truncate flex-1 mx-3 text-base">
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
                      <DeleteForeverIcon className="lg:scale-105 scale-90 mr-2" />
                    </span>
                  )}
                </div>
              )}
            </span>
          </button>
        </div>
      ))}
      {/* add another board */}
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
