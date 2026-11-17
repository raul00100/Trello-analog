import React, { useState, useEffect } from "react";
//icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
//components and shared elements
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TodoList from "./TodoList";
import SharedInput from "../../../shared/components/SharedInput";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import type { Column } from "../model/boardTypes";
//animation and design
import { AnimatePresence, motion } from "framer-motion";

export type ColumnListProps = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

const buttonActions =
  "lg:w-[65.5px] w-[52.5px] lg:h-9 h-7 transition-all rounded-xl flex items-center justify-center cursor-pointer";
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
  const [showSetting, setShowSetting] = useState<string | null>("");

  // close settings popup when clicking outside of it
  useEffect(() => {
    if (!showSetting) return;

    const handleClickOutside = (e: MouseEvent) => {
      const el = document.querySelector(`[data-settings-id="${showSetting}"]`);
      if (el && !el.contains(e.target as Node)) {
        setShowSetting(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSetting]);

  const addColumn = () => {
    const newColumn = {
      id: Date.now().toString(),
      name: "",
      todos: [],
    };
    setColumns([...columns, newColumn]);
    setEditingIndex(columns.length);
    setEditingNaming(`Column ${columns.length + 1}`);
  };

  const deleteColumn = (index: number) => {
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
                {columns.map((column, index) => (
                  <Draggable
                    key={column.id}
                    draggableId={String(column.id)}
                    index={index}
                  >
                    {(provided) => (
                      <motion.div
                        key={column.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            className={` ${columnStyle} lg:w-[272px] w-[220px] flex-col p-3 ${
                              column.name && column.name === searchColumn
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
                                className="lg:text-lg mb-1.5 text-base font-sans bg-black rounded px-2 focus:outline-none focus:border-white border-1 border-black text-zinc-300"
                              />
                            ) : (
                              <div className="flex flex-row justify-between items-center">
                                <span
                                  onDoubleClick={() => {
                                    setEditingIndex(index);
                                    setEditingNaming(columns[index].name);
                                  }}
                                >
                                  <h2 className="lg:text-lg text-base font-medium font-sans text-white cursor-pointer mb-2 truncate lg:w-50 w-35">
                                    {columns[index].name}
                                  </h2>
                                </span>
                                <button
                                  onClick={() => setShowSetting(column.id)}
                                  className="mb-2"
                                >
                                  <MoreVertIcon className="cursor-pointer lg:scale-100 scale-90" />
                                </button>
                                {showSetting === column.id && (
                                  <div
                                    data-settings-id={column.id}
                                    className="absolute left-1 top-0 mt-2 lg:w-[262px] w-[210px] lg:h-9 h-7 bg-black text-white rounded-xl flex flex-row z-50 text-sm items-center justify-center"
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingIndex(index);
                                        setEditingNaming(columns[index].name);
                                        setShowSetting(null);
                                      }}
                                      className={`${buttonActions}  hover:bg-zinc-400 `}
                                    >
                                      <DriveFileRenameOutlineIcon />
                                    </button>
                                    <button
                                      onClick={() => {
                                        deleteColumn(index);
                                        setShowSetting(null);
                                      }}
                                      className={`${buttonActions} hover:bg-zinc-400 `}
                                    >
                                      <DeleteOutlineIcon />
                                    </button>
                                    <button
                                      onClick={() => setShowSetting(null)}
                                      className={`${buttonActions} hover:bg-red-700`}
                                    >
                                      <CloseIcon />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            <TodoList
                              todos={column.todos}
                              setTodos={(newTodos) => {
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
                        </div>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
              <button
                onClick={addColumn}
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
