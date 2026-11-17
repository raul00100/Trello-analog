import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";

import { Button } from "../../../shared/components/ui/button";
import { Textarea } from "../../../shared/components/ui/textarea";

import TodoEditModal from "./Modals/TodoEditModal";

import { type Todo } from "../model/boardTypes";

type TodoListProps = {
  columnId: string;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  todoEditRequestId: string | null;
  onTodoEditRequestHandled: (columnId: string, todoId: string) => void;
};

type TodoListMode =
  | { type: "idle" }
  | { type: "adding" }
  | { type: "editing"; todoId: string; value: string };

export default function TodoList({
  columnId,
  todos,
  setTodos,
  todoEditRequestId,
  onTodoEditRequestHandled,
}: TodoListProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<TodoListMode>({ type: "idle" });

  useEffect(() => {
    if (!todoEditRequestId) return;

    const todo = todos.find((item) => item.id === todoEditRequestId);
    if (todo) {
      setMode({ type: "editing", todoId: todo.id, value: todo.text });
    }
    onTodoEditRequestHandled(columnId, todoEditRequestId);
  }, [
    columnId,
    onTodoEditRequestHandled,
    todoEditRequestId,
    todos,
  ]);

  const addTodo = () => {
    if (mode.type !== "adding" || input.trim() === "") return;
    setTodos((currentTodos) => [
      ...currentTodos,
      { id: Date.now().toString(), text: input, done: false },
    ]);
    setInput("");
    setMode({ type: "idle" });
  };

  const removeTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    setMode({ type: "idle" });
  };

  const saveTodoEdit = () => {
    if (mode.type !== "editing" || mode.value.trim() === "") return;
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === mode.todoId ? { ...todo, text: mode.value } : todo,
      ),
    );
    setMode({ type: "idle" });
  };

  const openTodoEditor = (id: string, text: string) => {
    setMode({ type: "editing", todoId: id, value: text });
  };

  const toggleDone = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
    if (mode.type === "adding") setMode({ type: "idle" });
  };

  return (
    <div className="flex flex-col">
      <ul className={`flex flex-col ${todos.length > 0 ? "mt-3 mb-5" : ""} `}>
        {todos.map((item) => (
          <li
            key={item.id}
            className="relative mt-1.5 flex h-7.5 w-full items-center gap-3 rounded-md bg-zinc-300 py-1 pl-3 text-black"
          >
            <div className="relative flex w-full min-w-0 flex-row items-center justify-between">
              <button
                type="button"
                aria-label={`Edit todo: ${item.text}`}
                onClick={() => openTodoEditor(item.id, item.text)}
                className="absolute inset-0 z-0 rounded bg-transparent p-0 focus-visible:outline focus-visible:outline-offset-[-2px] focus-visible:outline-white cursor-pointer"
              />
              <label className="relative z-10 inline-flex shrink-0 cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={item.done}
                  onChange={() => toggleDone(item.id)}
                />
                <div
                  className={`w-[19px] h-[19px] rounded-full border-2 mr-2 flex items-center justify-center ${
                    item.done ? "bg-lime-600 border-none" : "border-black"
                  } transition-all`}
                >
                  <DoneOutlineIcon
                    className={`hidden scale-53 ${
                      item.done ? "text-black" : "text-zinc-300"
                    }`}
                  />
                </div>
              </label>
              <span
                className={`pointer-events-none relative z-10 min-w-0 flex-1 truncate text-left lg:text-base text-sm mr-2 ${
                  item.done ? "line-through text-gray-400" : ""
                }`}
              >
                {item.text}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {mode.type === "adding" ? (
        <div>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-4 h-20 max-h-screen resize-none rounded-lg border-1 border-zinc-200  bg-black py-1.5 pl-2 text-base text-white placeholder:text-gray-400  focus-visible:ring-white focus-visible:ring-offset-0"
            placeholder="Add a new todo..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTodo();
              }
            }}
          />
          <div className="flex flex-row justify-center my-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMode({ type: "idle" })}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={addTodo}
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setMode({ type: "adding" })}
          className={` ${todos.length === 0 ? "my-4" : ""} font-bold text-white text-sm flex items-center gap-1.5 hover:bg-black active:bg-zinc-800 pl-2 rounded-sm py-1 transition-all cursor-pointer mb-3 opacity-60 hover:opacity-100`}
        >
          <AddIcon />
          Add Todo
        </button>
      )}
      {mode.type === "editing" && (
        <TodoEditModal
          value={mode.value}
          onChange={(value) =>
            setMode((currentMode) =>
              currentMode.type === "editing"
                ? { ...currentMode, value }
                : currentMode,
            )
          }
          onSave={saveTodoEdit}
          onDelete={() => removeTodo(mode.todoId)}
          onCancel={() => setMode({ type: "idle" })}
        />
      )}
    </div>
  );
}
