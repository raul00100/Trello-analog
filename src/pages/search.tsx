import { useState, useMemo } from "react";
import SharedInput from "../shared/sharedInput";
import ErrorIcon from "@mui/icons-material/Error";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardType = {
  name: string;
  lists: ColumnCard[];
};

type SearchProp = {
  boards: BoardType[];
};

export default function Search({ boards }: SearchProp) {
  const [searchText, setSearchText] = useState("");
  const location = useLocation();

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="ml-20">
          <SharedInput
            value={searchText}
            onChange={setSearchText}
            className=" bg-white/20 backdrop-blur-md border-2 border-white text-white rounded h-12 mt-10 mb-3 w-60 text-lg"
            placeholder="Search..."
          />
          {searchText.trim() !== "" && (
            <ul
              className={`text-black bg-white rounded p-3 ${
                filtered.length > 0 ? "w-150" : "w-60"
              }`}
            >
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
                          className="m-3 border-b-2 border-black pb-2 hover:scale-103 transition-all w-138 cursor-pointer"
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
                <div className="flex flex-row">
                  <p className="text-gray-500 mr-1">No results found</p>
                  <ErrorIcon className="animate-pulse" />
                </div>
              )}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
