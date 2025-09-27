import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import SharedInput from "./sharedInput";

type CardType = {
  card: { text: string; done: boolean }[];
  setCard: React.Dispatch<
    React.SetStateAction<{ text: string; done: boolean }[]>
  >;
};

export default function Column({ card, setCard }: CardType) {
  const [input, setInput] = useState("");
  const [add, setAdd] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addTodo = () => {
    if (input.trim() === "") return;
    setCard([...card, { text: input, done: false }]);
    setInput("");
  };

  const removeTodo = (index: number) => {
    setCard(card.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, value: string) => {
    const updated = [...card];
    updated[index].text = value;
    setCard(updated);
  };

  const toggleDone = (index: number) => {
    const updated = [...card];
    updated[index].done = !updated[index].done;
    setCard(updated);
  };

  return (
    <div className="flex flex-col" onClick={() => setEditingIndex(null)}>
      {card.map((item, index) => (
        <ul
          key={index}
          className="bg-zinc-300 text-black pl-3 rounded-md text-sm mt-1.5 py-1"
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setAdd(false)}
        >
          <li>
            {/* editing a todo */}
            {editingIndex === index && add === false ? (
              <div className="flex flex-row items-center justify-between">
                {/* <input
                  ref={(el) => {
                    if (el) el.focus();
                  }}
                  type="text"
                  className="text-black rounded border-none focus:outline-none pl-0.5"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => {
                    if (editingValue.trim() === "") {
                      removeTodo(index);
                    } else {
                      handleEdit(index, editingValue);
                    }
                    setEditingIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editingValue.trim() === "") {
                        removeTodo(index);
                      } else {
                        handleEdit(index, editingValue);
                      }
                      setEditingIndex(null);
                    }
                  }}
                /> */}
                <SharedInput
                  value={editingValue}
                  onChange={setEditingValue}
                  onSubmit={(newValue) => {
                    if (newValue.trim() === "") {
                      removeTodo(index);
                    } else {
                      handleEdit(index, newValue);
                    }
                    setEditingIndex(null);
                  }}
                  className="text-black rounded border-none focus:outline-none pl-0.5"
                />
                <EditIcon sx={{ marginRight: 2 }} />
              </div>
            ) : (
              //  viewing the list
              //checkbox thing
              <div className=" flex flex-row items-center justify-between">
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
                  onDoubleClick={() => {
                    if (item.done) return;
                    setEditingIndex(index);
                    setEditingValue(item.text);
                  }}
                  className={`flex-1 cursor-pointer select-text ${
                    item.done ? "line-through text-gray-400" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeTodo(index)}
                  className={`hover:text-red-700 px-2 rounded mr-2 cursor-pointer   ${
                    hovered === index ? "opacity-100" : "opacity-0"
                  } transition-all duration-300`}
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </li>
        </ul>
      ))}
      {/* adding a new card */}
      {add ? (
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-20 pt-1.5 mt-4 bg-black w-full text-white placeholder:text-gray-400 text-base rounded-lg pl-2 max-h-screen resize-none focus:outline-none border-1 border-black focus:border-zinc-100"
            placeholder="Add a new todo..."
            ref={(el) => {
              if (el) el.focus();
            }}
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
          Add Card
        </button>
      )}
    </div>
  );
}
