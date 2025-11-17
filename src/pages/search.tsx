import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
//components and context
import { useSharedProvider } from "../shared/context/useSharedProvider";
import SharedInput from "../shared/sharedInput";
import History from "../components/history";
//icons
import ErrorIcon from "@mui/icons-material/Error";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const arrowStyle = "scale-90 mx-1";
const arrowBlock = "flex items-center ";

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

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

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

  const handleHistory = (newValue: {
    boardName: string;
    colName?: string;
    todoName?: string;
  }) => {
    const exists = history.some(
      (item) =>
        item.boardName === newValue.boardName &&
        item.colName === newValue.colName &&
        item.todoName === newValue.todoName
    );
    if (!exists) {
      setHistory([...history, newValue]);
    }
  };

  const deleteHistory = (index: number) => {
    setHistory(history.filter((_, i) => i !== index));
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
        {/* search part */}
        <div className="lg:ml-20 flex lg:items-start items-center flex-col mt-10 lg:mt-0">
          <SharedInput
            value={searchText}
            onChange={setSearchText}
            className=" bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-sm lg:h-10 h-10 mb-3 w-60 text-lg"
            placeholder="Search..."
          />
          {searchText.trim() !== "" && (
            <ul
              className={`text-black bg-zinc-300 rounded p-3 flex items-center justify-center pb-6 ${
                filtered.length > 0 ? "lg:w-140 w-90" : "w-60"
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
                          className="border-b-2 border-black py-3 lg:w-130 w-80 cursor-pointer lg:text-lg text-base"
                          onClick={() => {
                            setSearchColumn(
                              item.colName ? item.colName : undefined
                            );
                            handleHistory(item);
                          }}
                        >
                          <div className="hover:scale-104 transition-all ml-3 flex flex-row">
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
                          </div>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex flex-row justify-between items-center pt-3">
                  <p className="text-gray-500 mr-1">No results found</p>
                  <ErrorIcon className="animate-pulse" />
                </div>
              )}
            </ul>
          )}
        </div>
        <History
          history={history}
          setHistory={setHistory}
          handleHistory={handleHistory}
          deleteHistory={deleteHistory}
        />
      </motion.div>
    </AnimatePresence>
  );
}
