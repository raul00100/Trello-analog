// Column.tsx
import React, { useState, useEffect } from "react";
import Column from "./column";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AnimatePresence, motion } from "motion/react";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };

type ColumnListProps = {
  columns: ColumnCard[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnCard[]>>;
};

export default function ColumnList({ columns, setColumns }: ColumnListProps) {
  const cards = columns;
  const setCards = setColumns;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const addEmptyCard = () => {
    setCards([
      ...cards,
      {
        id: Date.now().toString(),
        name: `Card ${cards.length + 1}`,
        todos: [],
      },
    ]);
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleOnDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  return (
    <div className=" mt-10 flex flex-row">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-row items-start"
            >
              <AnimatePresence>
                {cards.map((card, index) => (
                  <Draggable
                    key={card.id}
                    draggableId={String(card.id)}
                    index={index}
                  >
                    {(provided) => (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-[#121212] text-white w-[272px] rounded-xl flex flex-col p-3 ml-10"
                      >
                        {editingIndex === index ? (
                          <input
                            ref={(el) => {
                              if (el) el.focus();
                            }}
                            value={editingNaming}
                            onChange={(e) => setEditingNaming(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                if (editingNaming.trim() === "") return;
                                const updatedCards = [...cards];
                                updatedCards[index].name = editingNaming;
                                setCards(updatedCards);
                                setEditingIndex(null);
                              }
                            }}
                            className="text-base font-medium font-sans bg-gray-700 rounded px-2 focus:outline-none focus:border-white border-2 border-gray-700 text-zinc-300 my-1.5"
                          />
                        ) : (
                          <div className="flex flex-row justify-between">
                            <span
                              onDoubleClick={() => {
                                setEditingIndex(index);
                                setEditingNaming(cards[index].name);
                              }}
                            >
                              <h2 className="text-lg font-medium font-sans text-white cursor-pointer py-0.5 mb-2">
                                {cards[index].name}
                              </h2>
                            </span>
                            <button
                              onClick={() => {
                                deleteCard(index);
                              }}
                              className="transition-all cursor-pointer scale-130 hover:scale-150 text-white mr-2 hover:text-red-700"
                            >
                              <RemoveIcon />
                            </button>
                          </div>
                        )}
                        <Column
                          card={card.todos}
                          setCard={(newTodos) => {
                            const updatedCards = [...cards];
                            const resolvedTodos =
                              typeof newTodos === "function"
                                ? newTodos(updatedCards[index].todos)
                                : newTodos;
                            updatedCards[index].todos = resolvedTodos;
                            setCards(updatedCards);
                          }}
                        />
                        <div className="flex justify-center rotate-90">
                          <span
                            {...provided.dragHandleProps}
                            className="cursor-grab"
                          >
                            {" "}
                            <DragIndicatorIcon />{" "}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}

              <div
                onClick={addEmptyCard}
                className="bg-zinc-300/40 text-white hover:bg-zinc-300 hover:text-black font-semiold bg-opa active:scale-90  w-40 h-11 rounded-md text-base flex items-center justify-center cursor-pointer transition-all ml-10 mr-10 flex-none"
              >
                <button className="mr-2">Add a column</button>
                <AssignmentAddIcon />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
