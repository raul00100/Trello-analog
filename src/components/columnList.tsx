// Column.tsx
import React, { useState, useEffect } from "react";
import Column from "./column";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { AnimatePresence, motion } from "motion/react";
import CompressIcon from "@mui/icons-material/Compress";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };

type ColumnListProps = {
  columns: ColumnCard[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnCard[]>>;
};

const buttonActions = "px-4 py-2 text-left hover:bg-zinc-400 transition-all";
const column =
  "text-white bg-white/20 backdrop-blur-md border-1 border-zinc-400 rounded-xl ml-10 relative";
const grab = "flex justify-center rotate-90";

export default function ColumnList({ columns, setColumns }: ColumnListProps) {
  const cards = columns;
  const setCards = setColumns;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const [compress, setCompress] = useState<string[]>([]);
  const [showSetting, setShowSetting] = useState<string | null>("");

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
                      >
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          {/* compress mode */}
                          {compress.includes(card.id) ? (
                            <div
                              className={`${column} w-20 h-59 flex-col justify-center gap-15`}
                            >
                              <button
                                onClick={() =>
                                  setCompress(
                                    compress.filter((i) => i !== card.id)
                                  )
                                }
                              >
                                <UnfoldMoreIcon className="scale-120 hover:scale-150 avtive:scale-120 rotate-45 cursor-pointer" />
                              </button>
                              <span className="rotate-90 inline-block text-2xl truncate">
                                {card.name}
                              </span>
                              <div className={grab}>
                                <span
                                  {...provided.dragHandleProps}
                                  className="cursor-grab"
                                >
                                  {" "}
                                  <DragIndicatorIcon />{" "}
                                </span>
                              </div>
                            </div>
                          ) : (
                            // defolt mode editing
                            <div
                              className={` ${column} w-[272px] flex-col p-3`}
                            >
                              {editingIndex === index ? (
                                <input
                                  ref={(el) => {
                                    if (el) el.focus();
                                  }}
                                  value={editingNaming}
                                  onChange={(e) =>
                                    setEditingNaming(e.target.value)
                                  }
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
                                //defoolt mode view
                                <div className="flex flex-row justify-between items-center">
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
                                    onClick={() => setShowSetting(card.id)}
                                  >
                                    <MoreVertIcon className="cursor-pointer" />
                                  </button>
                                  {/* actions */}
                                  {showSetting === card.id && (
                                    <div className="absolute left-3 top-13 mt-2 w-60 bg-zinc-200 text-black rounded shadow-lg flex flex-col z-50 text-sm">
                                      <div className="flex flex-row">
                                        <h1 className="py-2 px-4 rounded-t font-medium mx-auto ml-9">
                                          Actions with the list
                                        </h1>
                                        <button
                                          onClick={() => setShowSetting(null)}
                                          className="mr-2 cursor-pointer hover:bg-zinc-400 my-1.5 rounded-md p-0.5"
                                        >
                                          <CloseIcon />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => {
                                          deleteCard(index);
                                          setShowSetting(null);
                                        }}
                                        className={buttonActions}
                                      >
                                        <RemoveIcon className="mr-2" />
                                        delete
                                      </button>
                                      <button
                                        onClick={() => {
                                          setCompress([...compress, card.id]);
                                          setShowSetting(null);
                                        }}
                                        className={`${buttonActions} mb-2`}
                                      >
                                        <CompressIcon className="mr-2" />
                                        compress
                                      </button>
                                    </div>
                                  )}
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
                              <div className={grab}>
                                <span
                                  {...provided.dragHandleProps}
                                  className="cursor-grab"
                                >
                                  {" "}
                                  <DragIndicatorIcon />{" "}
                                </span>
                              </div>
                            </div>
                          )}
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
