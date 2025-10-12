import { useState, useEffect } from "react";
import type { Board } from "../exportType";
import { SharedContext } from "./sharedContext";

export const SharedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    const savedBoard = localStorage.getItem("board");
    return savedBoard && savedBoard !== "undefined"
      ? JSON.parse(savedBoard)
      : [];
  });
  const [more, setMore] = useState(() => {
    const savedMore = localStorage.getItem("more");
    return savedMore ? JSON.parse(savedMore) : false;
  });
  const [searchColumn, setSearchColumn] = useState<string | undefined>("");

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);
  useEffect(() => {
    localStorage.setItem("more", JSON.stringify(more));
  }, [more]);

  //clear the searched column after 5s when user went through the search page to the exact column
  useEffect(() => {
    if (searchColumn) {
      const timer = setTimeout(() => {
        setSearchColumn(undefined);
      }, 5000);

      return clearTimeout(timer);
    }
  }, [searchColumn]);

  const addBoard = (navigate?: (path: string) => void) => {
    if (boards.length === 0) {
      setBoards([{ name: "Board 1", lists: [] }]);
    } else {
      setBoards([...boards, { name: "", lists: [] }]);
    }
    if (navigate) navigate(`/board/${boards.length}`);
  };

  return (
    <SharedContext.Provider
      value={{
        boards,
        setBoards,
        more,
        setMore,
        addBoard,
        searchColumn,
        setSearchColumn,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};
