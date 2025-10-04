import React, { useCallback, useEffect } from "react";
import ColumnList from "../components/columnList";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (!boards[boardId]) {
      if (boards.length > 0) {
        navigate(`/board/${boardId - 1}`);
      } else {
        navigate("/");
      }
    }
  }, [boards, boardId, navigate]);

  const handleColumns = useCallback(
    (newColumns: ColumnCard[] | ((prev: ColumnCard[]) => ColumnCard[])) => {
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
    },
    [setBoards, boardId]
  );

  if (!boards[boardId]) {
    return null;
  }

  return (
    <div className="pb-30">
      <AnimatePresence mode="wait">
        <motion.div
          key={boardId}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ColumnList
            columns={boards[boardId].lists}
            setColumns={handleColumns}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
