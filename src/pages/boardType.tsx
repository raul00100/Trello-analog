import React from "react";
import ColumnList from "../components/columnList";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";

// Типы
type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type Board = { name: string; lists: ColumnCard[] };

type BoardTypeProps = {
  boards?: Board[];
  setBoards?: React.Dispatch<React.SetStateAction<Board[]>>;
  currentBoard?: number;
};

function getBoardId(id: string | undefined, currentBoard?: number) {
  if (id && !isNaN(Number(id))) return Number(id);
  if (currentBoard !== undefined) return currentBoard;
  return 0;
}

export default function BoardType({
  boards,
  setBoards,
  currentBoard,
}: BoardTypeProps) {
  const { id } = useParams<{ id: string }>();
  const boardId = getBoardId(id, currentBoard);

  if (
    !boards ||
    boards.length === 0 ||
    boardId < 0 ||
    boardId >= boards.length
  ) {
    return <div className="overflow-hidden h-screen" />;
  }

  return (
    <div className="overflow-x-auto h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={boards[boardId].name}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ColumnList
            columns={boards[boardId].lists}
            setColumns={(newColumns) => {
              if (!setBoards) return;
              setBoards((boards) =>
                boards.map((b, index) =>
                  index === boardId
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
  );
}
