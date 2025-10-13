import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
//components and context
import { useSharedProvider } from "../shared/context/useSharedProvider";
import SharedInput from "../shared/sharedInput";
//icons
import HistoryIcon from "@mui/icons-material/History";
import ErrorIcon from "@mui/icons-material/Error";

export default function Search() {
  const { boards, setSearchColumn } = useSharedProvider();
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const [history, setHistory] = useState<
    {
      boardName: string;
      colName?: string;
      todoName?: string;
    }[]
  >(() => {
    const savedHistory = localStorage.getItem("history");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const filtered = useMemo(() => {
    const m = searchText.trim().toLowerCase();
    if (!m) return [];

    const results: {
      boardName: string;
      colName?: string;
      todoName?: string;
    }[] = [];

    boards?.forEach((board) => {
      if (board?.name?.toLowerCase().includes(m)) {
        results.push({ boardName: board.name });
        return;
      }

      board?.lists?.forEach((col) => {
        if (col?.name?.toLowerCase().includes(m)) {
          results.push({ boardName: board.name, colName: col.name });
          return;
        }

        col?.todos?.forEach((todo) => {
          if (todo?.text?.toLowerCase().includes(m)) {
            results.push({
              boardName: board.name,
              colName: col.name,
              todoName: todo.text,
            });
          }
        });
      });
    });

    return results;
  }, [boards, searchText]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const handleHistory = (newValue: {
    boardName: string;
    colName?: string;
    todoName?: string;
  }) => {
    setHistory([...history, newValue]);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex lg:justify-between justify-top items-center lg:items-start w-screen flex-col lg:flex-row mt-10 h-screen"
      >
        <div className="lg:ml-20 flex lg:items-start items-center flex-col">
          <SharedInput
            value={searchText}
            onChange={setSearchText}
            className=" bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-sm lg:h-10 h-10 mb-3 w-60 text-lg"
            placeholder="Search..."
          />
          {searchText.trim() !== "" && (
            <ul
              className={`text-black bg-white rounded p-3 ${
                filtered.length > 0 ? "lg:w-150 w-90" : "w-60"
              }`}
            >
              {/* show output when search text is not empty */}
              {filtered.length > 0 ? (
                <ul>
                  {filtered.map((item, idx) => {
                    const boardIdx = boards.findIndex(
                      (b) => b.name === item.boardName
                    );
                    return (
                      <Link key={idx} to={`/board/${boardIdx}`}>
                        <li
                          key={idx}
                          className="mt-4 lg:m-2 border-b-2 border-black pb-4 hover:scale-105 transition-all lg:w-138 w-80 cursor-pointer lg:text-lg text-base"
                          onClick={() => {
                            setSearchColumn(
                              item.colName ? item.colName : undefined
                            );
                            handleHistory(item);
                          }}
                        >
                          Board: {item.boardName}
                          {item.colName && ` > Column: ${item.colName}`}
                          {item.todoName && ` > Todo: ${item.todoName}`}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-row justify-between">
                  <p className="text-gray-500 mr-1">No results found</p>
                  <ErrorIcon className="animate-pulse" />
                </div>
              )}
            </ul>
          )}
        </div>
        <div className="lg:mr-20 flex lg:items-end items-center flex-col lg:mt-0 mt-10">
          <h2 className="text-white lg:text-2xl text-lg mr-50 mb-7">
            Search History:
          </h2>
          {history.map((item, idx) => {
            const boardIdx = boards.findIndex((b) => b.name === item.boardName);
            return (
              <Link key={idx} to={`/board/${boardIdx}`}>
                <li
                  key={idx}
                  className="h-12 bg-white/20 backdrop-blur-md hover:scale-105 transition-all lg:w-130 w-90 cursor-pointer lg:text-lg text-base my-2 text-white flex items-center pl-4 rounded-md border-1 border-white hover:bg-white/30 truncate"
                  onClick={() => {
                    setSearchColumn(item.colName ? item.colName : undefined);
                    handleHistory(item);
                  }}
                >
                  {item.boardName}
                  {item.colName && ` > ${item.colName}`}{" "}
                  {item.todoName && ` > ${item.todoName}`}{" "}
                </li>
              </Link>
            );
          })}
          {history.length !== 0 && (
            <button
              className="mb-10 text-white mt-5 lg:text-xl text-lg cursor-pointer active:scale-95 active:bg-white/20 hover:rounded-md hover:backdrop-blur-md hover:border-1 px-1 hover:border-white w-40 h-10 transition-all duration-300 rounded-md flex items-center justify-center"
              onClick={() => setHistory([])}
            >
              Clear History
              <HistoryIcon className="ml-2 scale-110" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
