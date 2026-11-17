"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import ColumnList from "../components/ColumnList";
import type { Column } from "../model/boardTypes";

function getBoardId(id: string | undefined): number | null {
  if (!id || !/^\d+$/.test(id)) return null;
  const boardId = Number(id);
  return Number.isSafeInteger(boardId) ? boardId : null;
}

export default function BoardPage() {
  const { boards, setBoards, setSearchColumn } = useSharedProvider();
  const { id } = useParams<{ id: string }>();
  const boardId = getBoardId(id);
  const navigate = useNavigate();

  useEffect(() => {
    if (boardId !== null && boards[boardId]) return;

    if (boards.length === 0) {
      navigate("/", { replace: true });
    } else {
      const destinationId =
        boardId === null ? 0 : Math.min(boardId, boards.length - 1);
      navigate(`/board/${destinationId}`, { replace: true });
    }
  }, [boards, boardId, navigate]);

  const handleColumns = useCallback(
    (newColumns: Column[] | ((prev: Column[]) => Column[])) => {
      setBoards((currentBoards) =>
        currentBoards.map((board, index) =>
          index === boardId
            ? {
                ...board,
                lists:
                  typeof newColumns === "function"
                    ? newColumns(board.lists)
                    : newColumns,
              }
            : board,
        ),
      );
    },
    [setBoards, boardId],
  );

  if (boardId === null || !boards[boardId]) {
    return null;
  }

  return (
    <div className="pb-30" onClick={() => setSearchColumn(undefined)}>
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
