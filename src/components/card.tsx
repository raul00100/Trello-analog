import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const todo = "bg-zinc-700 text-white pl-3 rounded-lg text-base mt-3 py-1";

export default function Card() {
  const [card, setCard] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [add, setAdd] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addCard = () => {
    if (input.trim() === "") return;
    setCard([...card, input]);
    setInput("");
  };

  const removeCard = (index: number) => {
    setCard(card.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number, value: string) => {
    const updated = [...card];
    updated[index] = value;
    setCard(updated);
  };

  return add ? (
    <div className="flex flex-col">
      {card.map((item, index) => (
        <ul key={index} className={todo}>
          <li>{item}</li>
        </ul>
      ))}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-20 pt-1.5 mt-4 bg-zinc-700 text-white placeholder:text-gray-400 rounded-lg pl-2 max-h-screen resize-none focus:outline-none border-2 border-zinc-700 focus:border-blue-400"
        placeholder="Add a new card"
      />
      <div className="flex flex-row mt-2">
        <button
          onClick={() => {
            addCard();
            setAdd(false);
          }}
          className="bg-blue-700 text-white text-base gap-1.5 active:bg-blue-500 pl-2 rounded-sm py-1 w-[155px] transition-all cursor-pointer hover:bg-blue-600 active:scale-95 "
        >
          Sumbit
        </button>
        <button
          onClick={() => setAdd(false)}
          className="hover:bg-[#916e02] ml-1.5 px-1 rounded cursor-pointer"
        >
          <CloseIcon sx={{ color: "white" }} />
        </button>
      </div>
    </div>
  ) : (
    <div>
      {card.map((item, index) => (
        <ul
          key={index}
          className={todo}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          <li className="flex justify-between items-center">
            {editingIndex === index ? (
              <div className="flex flex-row ">
                <input
                  className="bg-zinc-700 text-white rounded border-none focus:outline-none"
                  value={editingValue}
                  autoFocus
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => {
                    if (editingValue.trim() === "") {
                      removeCard(index);
                    } else {
                      handleEdit(index, editingValue);
                    }
                    setEditingIndex(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editingValue.trim() === "") {
                        removeCard(index);
                      } else {
                        handleEdit(index, editingValue);
                      }
                      setEditingIndex(null);
                    }
                  }}
                />
                <EditIcon />
              </div>
            ) : (
              <span
                onDoubleClick={() => {
                  setEditingIndex(index);
                  setEditingValue(item);
                }}
                className="flex-1 cursor-pointer select-text"
              >
                {item}
              </span>
            )}
            <button
              onClick={() => removeCard(index)}
              className={`hover:bg-red-600 text-white px-2 text-base rounded mr-1.5 cursor-pointer   ${
                hovered === index ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300`}
            >
              <DeleteIcon />
            </button>
          </li>
        </ul>
      ))}
      <button
        onClick={() => setAdd(true)}
        className="bg-[#7f5f01] mt-4 text-gray-300 text-base flex items-center gap-1.5 active:bg-[#916e02] w-full pl-2 rounded-lg py-1 active:text-white transition"
      >
        <AddIcon />
        Add Card
      </button>
    </div>
  );
}
