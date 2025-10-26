import React, { useState, useEffect } from "react";
//icons
import CompressIcon from "@mui/icons-material/Compress";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
//components and shared elements
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Column from "./column";
import SharedInput from "../shared/sharedInput";
import { useSharedProvider } from "../shared/context/useSharedProvider";
import type { ColumnCard } from "../shared/exportType";
//animation and design
import { AnimatePresence, motion } from "framer-motion";
import "../index.css";

export type ColumnListProps = {
  columns: ColumnCard[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnCard[]>>;
};

const buttonActions = "px-4 py-2 text-left hover:bg-zinc-400 transition-all";
const columnStyle =
  "text-white bg-white/20 backdrop-blur-md border-1 border-zinc-400 rounded-lg lg:ml-10 ml-5 flex ";
const grab = "flex justify-center rotate-90";

const ColumnList = React.memo(function ColumnList({
  columns,
  setColumns,
}: ColumnListProps) {
  const { searchColumn } = useSharedProvider();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");
  const [compress, setCompress] = useState<string[]>(() => {
    const savedCompress = localStorage.getItem("compress");
    return savedCompress ? JSON.parse(savedCompress) : [];
  });
  const [showSetting, setShowSetting] = useState<string | null>("");

  useEffect(() => {
    localStorage.setItem("column", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("compress", JSON.stringify(compress));
  }, [compress]);

  const addEmptyCard = () => {
    const newCard = {
      id: Date.now().toString(),
      name: "",
      todos: [],
    };
    setColumns([...columns, newCard]);
    setEditingIndex(columns.length);
    setEditingNaming(`Column ${columns.length + 1}`);
  };

  const deleteCard = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  // drag and drop functionality
  const handleOnDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    if (!result.destination) return;
    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setColumns(items);
  };

  return (
    <div className="lg:mt-10 mt-10 flex flex-row">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="column" direction="horizontal">
          {(provided) => (
            <section
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-row items-start overflow-visible"
            >
              <AnimatePresence>
                {columns.map((card, index) => (
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
                              className={`${columnStyle} w-20 h-60 flex-col justify-between py-3.5 relative z-10`}
                            >
                              <button
                                onClick={() =>
                                  setCompress(
                                    compress.filter((i) => i !== card.id)
                                  )
                                }
                                className="transition-all"
                              >
                                <UnfoldMoreIcon className="scale-120 hover:scale-150 active:scale-120 rotate-45 cursor-pointer" />
                              </button>
                              <span className="rotate-270 inline-block lg:text-xl text-lg font-medium truncate">
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
                            // default mode - editing
                            <div
                              className={` ${columnStyle} lg:w-[272px] w-[220px] flex-col p-3 ${
                                card.name && card.name === searchColumn
                                  ? "bounce"
                                  : ""
                              }`}
                            >
                              {editingIndex === index ? (
                                <SharedInput
                                  value={editingNaming}
                                  onChange={setEditingNaming}
                                  onSubmit={(newValue) => {
                                    const updatedColumn = [...columns];
                                    updatedColumn[index].name = newValue;
                                    setColumns(updatedColumn);
                                    setEditingIndex(null);
                                  }}
                                  onFocus={() => {}}
                                  className="text-base font-medium font-sans bg-black rounded px-2 focus:outline-none focus:border-white border-1 border-black text-zinc-300 my-[7px]"
                                />
                              ) : (
                                //default mode - view
                                <div className="flex flex-row justify-between items-center">
                                  <span
                                    onDoubleClick={() => {
                                      setEditingIndex(index);
                                      setEditingNaming(columns[index].name);
                                    }}
                                  >
                                    <h2 className="lg:text-lg text-base font-medium font-sans text-white cursor-pointer py-0.5 mb-2 truncate lg:w-50 w-35">
                                      {columns[index].name}
                                    </h2>
                                  </span>
                                  <button
                                    onClick={() => setShowSetting(card.id)}
                                    className="mb-2"
                                  >
                                    <MoreVertIcon className="cursor-pointer lg:scale-100 scale-90" />
                                  </button>
                                  {/* actions with a column*/}
                                  {showSetting === card.id && (
                                    <div className="absolute lg:left-3 top-13 left-0 mt-2 w-60 bg-zinc-200 text-black rounded shadow-lg flex flex-col z-50 text-sm">
                                      <div className="flex flex-row">
                                        <h4 className="py-2 px-4 rounded-t font-medium mx-auto ml-9">
                                          Actions with the list
                                        </h4>
                                        <button
                                          onClick={() => setShowSetting(null)}
                                          className="mr-2 cursor-pointer hover:bg-zinc-400 my-1.5 rounded-md p-0.5"
                                        >
                                          <CloseIcon />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() => {
                                          setEditingIndex(index);
                                          setEditingNaming(columns[index].name);
                                          setShowSetting(null);
                                        }}
                                        className={buttonActions}
                                      >
                                        <DriveFileRenameOutlineIcon className="mr-2" />
                                        Rename
                                      </button>
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
                              {/* list of column  */}
                              <Column
                                cards={card.todos}
                                setCards={(newTodos) => {
                                  const updatedColumn = [...columns];
                                  updatedColumn[index].todos =
                                    typeof newTodos === "function"
                                      ? newTodos(updatedColumn[index].todos)
                                      : newTodos;
                                  setColumns(updatedColumn);
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
              <button
                onClick={addEmptyCard}
                className="bg-white/20 backdrop-blur-md border-1 border-zinc-400 text-white font-semibold bg-opa active:scale-90 lg:w-40 lg:h-11 w-34 h-9 rounded-md lg:text-base text-sm flex items-center justify-center cursor-pointer transition-all lg:mx-10 mx-5 flex-none z-0"
              >
                <span className="mr-2"> Add a column </span>
                <AssignmentAddIcon className="scale-90 lg:scale-100" />
              </button>
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
});
export default ColumnList;
