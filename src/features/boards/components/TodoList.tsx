import React, { useState } from "react";
//icons
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { Textarea } from "../../../shared/components/ui/textarea";

type CardsType = {
  cards: { id: string; text: string; done: boolean }[];
  setCards: React.Dispatch<
    React.SetStateAction<{ id: string; text: string; done: boolean }[]>
  >;
};

export default function Column({ cards, setCards }: CardsType) {
  const [editingValue, setEditingValue] = useState("");
  const [input, setInput] = useState("");
  const [add, setAdd] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addTodo = () => {
    if (input.trim() === "") return;
    setCards([
      ...cards,
      { id: Date.now().toString(), text: input, done: false },
    ]);
    setInput("");
  };

  const removeTodo = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, value: string) => {
    const updated = [...cards];
    updated[index].text = value;
    setCards(updated);
  };

  const finishEdit = (index: number, value: string, removeIfEmpty = false) => {
    if (value.trim() === "") {
      if (removeIfEmpty) removeTodo(index);
      else return;
    } else {
      handleEdit(index, value);
    }
    setEditingIndex(null);
  };

  const toggleDone = (index: number) => {
    const updated = [...cards];
    updated[index].done = !updated[index].done;
    setCards(updated);
  };

  return (
    <div className="flex flex-col">
      {cards.map((item, index) => (
        <ul
          key={index}
          className="bg-zinc-300 text-black pl-3 rounded-md mt-1.5 py-1 h-7.5 flex items-center relative z-0"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setAdd(false)}
          onDoubleClick={() => {
            if (item.done) return;
            setEditingIndex(index);
            setEditingValue(item.text);
          }}
        >
          <li>
            {/* editing a todo */}
            {editingIndex === index && add === false ? (
              <div className="flex flex-row items-center justify-between">
                <Textarea
                  value={editingValue}
                  onChange={(event) => setEditingValue(event.target.value)}
                  autoFocus
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      finishEdit(index, editingValue, true);
                    }
                  }}
                  onBlur={() => finishEdit(index, editingValue)}
                  className="h-7.5 min-h-0 w-51 resize-none rounded border-none bg-transparent px-2 py-0 text-base text-black shadow-none focus-visible:ring-0"
                />
                <EditIcon />
              </div>
            ) : (
              //  viewing the list
              <div className=" flex flex-row items-center justify-between lg:w-full w-[185px]">
                {/* checkbox thing */}
                <label className="inline-flex items-center cursor-pointer">
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
                {/* todo text */}
                <span
                  className={`flex-1 cursor-pointer lg:text-base text-sm truncate w-42 ${
                    item.done ? "line-through text-gray-400" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeTodo(index)}
                  className={`hover:text-red-700 px-2.5 rounded cursor-pointer   ${
                    hovered === index ? "opacity-100" : "opacity-0"
                  } transition-all duration-300`}
                >
                  <DeleteIcon className="scale-90 lg:scale-100" />
                </button>
              </div>
            )}
          </li>
        </ul>
      ))}
      {/* adding a new cards */}
      {add ? (
        <div>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="mt-4 h-20 max-h-screen resize-none rounded-lg  bg-black py-1.5 pl-2 text-base text-white placeholder:text-gray-400 focus-visible:border-zinc-100 focus-visible:ring-1"
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
    </div>
  );
}
