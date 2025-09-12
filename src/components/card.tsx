import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

const todo = "bg-[#A1C2BD] text-black pl-3 rounded-lg text-base mt-3 py-1 ";

// type CardType = {
//   card: { text: string; done: boolean }[];
//   setCard: React.Dispatch<
//     React.SetStateAction<{ text: string; done: boolean }[]>
//   >;
// };

export default function Card() {
  const [card, setCard] = useState<{ text: string; done: boolean }[]>(() => {
    const savedCard = localStorage.getItem("card");
    return savedCard ? JSON.parse(savedCard) : [];
  });
  const [input, setInput] = useState("");
  const [add, setAdd] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    localStorage.setItem("card", JSON.stringify(card));
  }, [card]);

  const addCard = () => {
    if (input.trim() === "") return;
    setCard([...card, { text: input, done: false }]);
    setInput("");
  };

  const removeCard = (index: number) => {
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

  return add ? (
    <div className="flex flex-col">
      {card.map((item, index) => (
        <ul key={index} className={todo}>
          <li className="py-[1px]">{item.text}</li>
        </ul>
      ))}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-20 pt-1.5 mt-4 bg-gray-700 text-white placeholder:text-gray-400 rounded-lg pl-2 max-h-screen resize-none focus:outline-none border-2 border-zinc-700 focus:border-blue-700"
        placeholder="Add a new card"
      />
      <div className="flex flex-row mt-2">
        <button
          onClick={() => {
            addCard();
            setAdd(false);
          }}
          className="bg-blue-800 text-white text-base gap-1.5 active:bg-blue-700 pl-2 rounded-sm py-1 w-[155px] transition-all cursor-pointer  active:scale-95 "
        >
          Submit
        </button>
        <button
          onClick={() => setAdd(false)}
          className="hover:bg-red-700 ml-1.5 px-1 rounded cursor-pointer"
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
          <li>
            {editingIndex === index ? (
              <div className="py-[1px] flex flex-row items-center justify-between">
                <input
                  className="bg-gray-700 text-white rounded border-none focus:outline-none pl-1.5"
                  value={editingValue}
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
                <EditIcon sx={{ marginRight: 2 }} />
              </div>
            ) : (
              <div className=" flex flex-row items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={item.done}
                    onChange={() => toggleDone(index)}
                  />
                  <div
                    className={`w-[19px] h-[19px] rounded-full border-2 border-zinc-400 mr-2 flex items-center justify-center ${
                      item.done ? "bg-green-600" : ""
                    } transition-all`}
                  >
                    <DoneIcon
                      className={`hidden scale-80 ${
                        item.done ? "text-zinc-800" : "text-[#A1C2BD]"
                      }`}
                    />
                  </div>
                </label>

                <span
                  onDoubleClick={() => {
                    if (item.done) return;
                    setEditingIndex(index);
                    setEditingValue(item.text);
                  }}
                  className={`flex-1 cursor-pointer select-text ${
                    item.done ? "line-through text-gray-700" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => removeCard(index)}
                  className={`hover:bg-red-600 px-2 rounded mr-2 cursor-pointer   ${
                    hovered === index ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300`}
                >
                  <DeleteIcon />
                </button>
              </div>
            )}
          </li>
        </ul>
      ))}
      <button
        onClick={() => setAdd(true)}
        className="bg-blue-900 mt-4 text-gray-300 text-base flex items-center gap-1.5 active:bg-blue-800 w-full pl-2 rounded-lg py-1 active:text-white transition"
      >
        <AddIcon />
        Add Card
      </button>
    </div>
  );
}
