import React, { useState } from "react";
//icons
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Textarea } from "../../../shared/components/ui/textarea";
import TodoEditDialog from "./TodoEditDialog";

type CardsType = {
  cards: { id: string; text: string; done: boolean }[];
  setCards: React.Dispatch<
    React.SetStateAction<{ id: string; text: string; done: boolean }[]>
  >;
};

export default function Column({ cards, setCards }: CardsType) {
  const [input, setInput] = useState("");
  const [add, setAdd] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    setCards([
      ...cards,
      { id: Date.now().toString(), text: input, done: false },
    ]);
    setInput("");
  };

  const removeTodo = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
    setEditingTodoId(null);
  };

  const saveTodoEdit = () => {
    if (!editingTodoId || editingValue.trim() === "") return;
    setCards(
      cards.map((card) =>
        card.id === editingTodoId ? { ...card, text: editingValue } : card,
      ),
    );
    setEditingTodoId(null);
  };

  const openTodoEditor = (id: string, text: string) => {
    setAdd(false);
    setEditingTodoId(id);
    setEditingValue(text);
  };

  const toggleDone = (index: number) => {
    const updated = [...cards];
    updated[index].done = !updated[index].done;
    setCards(updated);
  };

  return (
    <div className="flex flex-col">
      {/* todo content */}
      {cards.map((item, index) => (
        <ul
          key={index}
          className="relative z-0 mt-1.5 flex h-7.5 w-full items-center rounded-md bg-zinc-300 pl-3 py-1 text-black"
          onClick={() => setAdd(false)}
        >
          <li className="w-full min-w-0">
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
                  onChange={() => toggleDone(index)}
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
        </ul>
      ))}

      {/* adding a new todo */}
      {add ? (
        <div>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-4 h-20 max-h-screen resize-none rounded-lg  bg-black py-1.5 pl-2 text-base text-white placeholder:text-gray-400 focus-visible:border-zinc-100 focus-visible:ring-offset-0"
            placeholder="Add a new todo..."
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTodo();
                setAdd(false);
              }
            }}
          />
          <div className="flex flex-row mt-2 mb-4.5">
            <button
              onClick={() => {
                addTodo();
                setAdd(false);
              }}
              className="bg-zinc-300 text-black text-base gap-1.5 active:scale-90 hover:bg-zinc-300 pl-2 rounded-sm py-1 w-[155px] transition-all cursor-pointer "
            >
              Submit
            </button>
            <button
              onClick={() => setAdd(false)}
              className="hover:bg-red-700 ml-2.5 px-1 rounded cursor-pointer transition-all"
            >
              <CloseIcon sx={{ color: "white" }} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdd(true)}
          className="font-bold mt-4 text-white text-sm flex items-center gap-1.5 hover:bg-black active:bg-zinc-800 pl-2 rounded-sm py-1 transition-all cursor-pointer mb-3 opacity-60 hover:opacity-100"
        >
          <AddIcon />
          Add Todo
        </button>
      )}
      {editingTodoId && (
        <TodoEditDialog
          value={editingValue}
          onChange={setEditingValue}
          onSave={saveTodoEdit}
          onDelete={() => removeTodo(editingTodoId)}
          onCancel={() => setEditingTodoId(null)}
        />
      )}
    </div>
  );
}
