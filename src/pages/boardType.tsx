import React from "react";
import ColumnList from "../components/columnList";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};
type GeneralProp = {
  boards?: BoardTypeProps[];
  setBoards?: React.Dispatch<React.SetStateAction<BoardTypeProps[]>>;
  currentBoard?: number;
};

export default function BoardType({
  boards,
  setBoards,
  currentBoard,
}: GeneralProp) {
  if (!boards || boards.length === 0 || currentBoard === undefined) {
    return <div className="overflow-hidden h-screen" />;
  }
  return (
    <div className="overflow-hidden h-screen">
      <main>
        <div className="overflow-x-auto h-screen">
          <ColumnList
            columns={boards[currentBoard].lists}
            setColumns={(newColumns) => {
              if (!setBoards) return;
              setBoards((boards) =>
                boards.map((b, index) =>
                  index === currentBoard
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
        </div>
      </main>
    </div>
  );
}
