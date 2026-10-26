import { useState, useEffect } from "react";
import type { Board } from "../exportType";
import { SharedContext } from "./sharedContext";

type StoredBoard = Omit<Board, "id"> & { id?: string };

export const SharedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    const savedBoard = localStorage.getItem("board");
    if (!savedBoard || savedBoard === "undefined") return [];

    const storedBoards: StoredBoard[] = JSON.parse(savedBoard);
    return storedBoards.map((board) => ({
      ...board,
      id: board.id || crypto.randomUUID(),
    }));
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
      setBoards([{ id: crypto.randomUUID(), name: "Board 1", lists: [] }]);
    } else {
      setBoards([
        ...boards,
        { id: crypto.randomUUID(), name: "", lists: [] },
      ]);
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
