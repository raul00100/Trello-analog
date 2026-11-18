import React, { useState } from "react";

import { useSharedProvider } from "../../../shared/context/useSharedProvider";
import { type Column } from "../model/boardTypes";

import { AnimatePresence, motion } from "framer-motion";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

import TodoList from "./TodoList";
import ColumnEditModal from "./Modals/ColumnEditModal";

export type ColumnListProps = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

const columnStyle =
  "text-white bg-white/20 backdrop-blur-md border-1 border-zinc-400 rounded-lg lg:ml-10 ml-5 flex ";
const grab = "flex justify-center rotate-90";

const ColumnList = React.memo(function ColumnList({
  columns,
  setColumns,
}: ColumnListProps) {
  const { searchColumn } = useSharedProvider();
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [newColumnDraft, setNewColumnDraft] = useState<Column | null>(null);
  const [todoEditRequest, setTodoEditRequest] = useState<{
    columnId: string;
    todoId: string;
  } | null>(null);
  const editingColumn =
    newColumnDraft ?? columns.find((column) => column.id === editingColumnId);

  const handleTodoEditRequestHandled = React.useCallback(
    (columnId: string, todoId: string) => {
      setTodoEditRequest((currentRequest) =>
        currentRequest?.columnId === columnId &&
        currentRequest.todoId === todoId
          ? null
          : currentRequest,
      );
    },
    [],
  );

  const addColumn = () => {
    setEditingColumnId(null);
    setTodoEditRequest(null);
    setNewColumnDraft({
      id: Date.now().toString(),
      name: `Column ${columns.length + 1}`,
      todos: [],
      createdAt: new Date().toISOString(),
    });
  };

  const saveColumnName = (name: string) => {
    if (newColumnDraft) {
      setColumns((currentColumns) => [
        ...currentColumns,
        { ...newColumnDraft, name },
      ]);
    } else if (editingColumnId) {
      setColumns((currentColumns) =>
        currentColumns.map((column) =>
          column.id === editingColumnId ? { ...column, name } : column,
        ),
      );
    } else {
      return;
    }

    setEditingColumnId(null);
    setNewColumnDraft(null);
    setTodoEditRequest(null);
  };

  const deleteColumn = () => {
    if (!editingColumnId) return;
    setColumns((currentColumns) =>
      currentColumns.filter((column) => column.id !== editingColumnId),
    );
    setEditingColumnId(null);
    setNewColumnDraft(null);
    setTodoEditRequest(null);
  };

  const cancelColumnEdit = () => {
    setEditingColumnId(null);
    setNewColumnDraft(null);
    setTodoEditRequest(null);
  };

  // drag and drop functionality
  const handleOnDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    const destination = result.destination;
    if (!destination) return;
    setColumns((currentColumns) => {
      const items = Array.from(currentColumns);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      return items;
    });
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
                            <div className="flex flex-row min-w-0 items-center justify-between">
                              <h2 className="min-w-0 flex-1 truncate font-sans text-base font-medium text-white lg:text-lg">
                                {column.name}
                              </h2>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewColumnDraft(null);
                                  setTodoEditRequest(null);
                                  setEditingColumnId(column.id);
                                }}
                                aria-label={`Open column: ${column.name || "Untitled"}`}
                                title="Open column"
                                className="flex items-center justify-center scale-95  cursor-pointer rounded p-1 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-white"
                              >
                                <OpenInFullIcon fontSize="small" />
                              </button>
                            </div>
                            <TodoList
                              columnId={column.id}
                              todos={column.todos}
                              todoEditRequestId={
                                todoEditRequest?.columnId === column.id
                                  ? todoEditRequest.todoId
                                  : null
                              }
                              onTodoEditRequestHandled={
                                handleTodoEditRequestHandled
                              }
                              setTodos={(todoUpdate) => {
                                setColumns((currentColumns) =>
                                  currentColumns.map((currentColumn) =>
                                    currentColumn.id === column.id
                                      ? {
                                          ...currentColumn,
                                          todos:
                                            typeof todoUpdate === "function"
                                              ? todoUpdate(currentColumn.todos)
                                              : todoUpdate,
                                        }
                                      : currentColumn,
                                  ),
                                );
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
      {editingColumn && (
        <ColumnEditModal
          key={editingColumn.id}
          column={editingColumn}
          isCreating={newColumnDraft !== null}
          onSave={saveColumnName}
          onDelete={deleteColumn}
          onCancel={cancelColumnEdit}
          onEditTodo={(todoId) => {
            setTodoEditRequest({ columnId: editingColumn.id, todoId });
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setEditingColumnId(null);
                setNewColumnDraft(null);
              });
            });
          }}
        />
      )}
    </div>
  );
});
export default ColumnList;
