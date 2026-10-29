"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
//components and shared elements
import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import ColumnList from "../components/ColumnList";
import type { ColumnCard } from "../model/boardTypes";

function getBoardId(id: string | undefined) {
  if (id && !isNaN(Number(id))) return Number(id);
  return 0;
}

export default function BoardPage() {
  const { boards, setBoards, setSearchColumn } = useSharedProvider();
  const { id } = useParams<{ id: string }>();
  const boardId = getBoardId(id);
  const router = useRouter();

  useEffect(() => {
    if (!boards[boardId]) {
      if (boards.length > 0) {
        router.replace(`/board/${boardId - 1}`);
      } else {
        router.replace("/");
      }
    }
  }, [boards, boardId, router]);

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
