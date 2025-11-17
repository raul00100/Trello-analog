import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
//components and context
import { useSharedProvider } from "../shared/context/useSharedProvider";
//icons
import HistoryIcon from "@mui/icons-material/History";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type HistoryProp = {
  history: {
    boardName: string;
    colName?: string | undefined;
    todoName?: string | undefined;
  }[];
  setHistory: Dispatch<
    SetStateAction<
      {
        boardName: string;
        colName?: string;
        todoName?: string;
      }[]
    >
  >;
  handleHistory: (newValue: {
    boardName: string;
    colName?: string | undefined;
    todoName?: string | undefined;
  }) => void;
  deleteHistory: (index: number) => void;
};

const historyBlock =
  "h-12 bg-white/20 backdrop-blur-md transition-all lg:w-130 w-80 lg:text-lg text-base my-2 text-white flex items-center pl-4 rounded-md border-1 border-white hover:bg-white/30 truncate";
const arrowStyle = "scale-90 mx-1";
const arrowBlock = "flex items-center ";
const buttonStyle =
  "text-white w-10 h-12 hover:bg-red-500/70 rounded-sm transition-all flex items-center justify-center hover:border-1 hover:border-white cursor-pointer";
const mainCont = "flex flex-row items-center justify-center w-full gap-2";
const deleteIcon = "scale-110";

export default function History({
  handleHistory,
  history,
  setHistory,
  deleteHistory,
}: HistoryProp) {
  const { boards, setSearchColumn } = useSharedProvider();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="lg:mr-20 mr-10 flex lg:items-end items-center flex-col lg:mt-0 mt-10 pb-15">
      <h2 className="text-white lg:text-2xl text-lg mr-50 mb-7">
        Search History:
      </h2>
      {history.length === 0 ? (
        <p className={`${historyBlock}`}>
          <span className="animate-pulse"> No items found </span>
        </p>
      ) : (
        <div>
          {history.map((item, idx) => {
            const boardIdx = boards.findIndex((b) => b.name === item.boardName);
            const board = boards[boardIdx];
            const colExists = item.colName
              ? board?.lists?.some((col) => col.name === item.colName)
              : true;
            const todoExists = item.todoName
              ? board?.lists
                  ?.find((col) => col.name === item.colName)
                  ?.todos?.some((todo) => todo.text === item.todoName)
              : true;

            const isValid = board && colExists && todoExists;

            return isValid ? (
              <div
                className={mainCont}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === idx ? (
                  <button
                    className={`${buttonStyle}`}
                    onClick={() => deleteHistory(idx)}
                  >
                    <DeleteOutlineIcon className={deleteIcon} />
                  </button>
                ) : (
                  <div className="w-10 h-12" />
                )}

                <Link key={idx} to={`/board/${boardIdx}`}>
                  <li
                    key={idx}
                    className={`${historyBlock} cursor-pointer justify-between flex-1 transition-transform`}
                    onClick={() => {
                      setSearchColumn(item.colName ? item.colName : undefined);
                      handleHistory(item);
                    }}
                  >
                    <span className="flex flex-row">
                      {item.boardName}
                      {item.colName && (
                        <div className={arrowBlock}>
                          <ArrowForwardIosIcon className={arrowStyle} />
                          {item.colName}
                        </div>
                      )}
                      {item.todoName && (
                        <div className={arrowBlock}>
                          <ArrowForwardIosIcon className={arrowStyle} />
                          {item.todoName}
                        </div>
                      )}
                    </span>
                  </li>
                </Link>
              </div>
            ) : (
              <div
                className={mainCont}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {hovered === idx ? (
                  <button
                    className={buttonStyle}
                    onClick={() => deleteHistory(idx)}
                  >
                    <DeleteOutlineIcon className={deleteIcon} />
                  </button>
                ) : (
                  <div className="w-10 h-12" />
                )}
                <li
                  key={idx}
                  className={`${historyBlock} justify-between cursor-not-allowed`}
                  onClick={() => {
                    alert(
                      "This item is no longer available due to changes or deletion"
                    );
                  }}
                >
                  <span className="flex flex-row">
                    {item.boardName}
                    {item.colName && (
                      <div className={arrowBlock}>
                        <ArrowForwardIosIcon className={arrowStyle} />
                        {item.colName}
                      </div>
                    )}
                    {item.todoName && (
                      <div className={arrowBlock}>
                        <ArrowForwardIosIcon className={arrowStyle} />
                        {item.todoName}
                      </div>
                    )}
                  </span>
                  <DoNotDisturbIcon className="mr-5 scale-110 animate-pulse" />
                </li>
              </div>
            );
          })}

          {history.length !== 0 && (
            <div className="flex justify-end ">
              <button
                className="text-white mt-5 lg:text-xl text-lg cursor-pointer active:scale-95 active:bg-white/20 hover:rounded-md hover:backdrop-blur-md hover:border-1 px-1 hover:border-white w-40 h-10 transition-all duration-300 rounded-md flex items-center justify-center mx-left"
                onClick={() => setHistory([])}
              >
                Clear History
                <HistoryIcon className="ml-2 scale-110" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
