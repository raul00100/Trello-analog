import React from "react";
import ColumnList from "../components/columnList";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type Board = { name: string; lists: ColumnCard[] };

type BoardTypeProps = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
};

function getBoardId(id: string | undefined) {
  if (id && !isNaN(Number(id))) return Number(id);
  return 0;
}

export default function BoardType({ boards, setBoards }: BoardTypeProps) {
  const { id } = useParams<{ id: string }>();
  const boardId = getBoardId(id);

  return (
    <div className="overflow-x-auto h-screen ">
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
