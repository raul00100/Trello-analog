// Column.tsx
import React, { useState, useEffect } from "react";
import Card from "./card";
import AddCardIcon from "@mui/icons-material/AddCard";
import RemoveIcon from "@mui/icons-material/Remove";

type Todo = { text: string; done: boolean }; // типизируем туду
type ColumnCard = { name: string; todos: Todo[] }; // создаем массив из туду

export default function Column() {
  const [cards, setCards] = useState<ColumnCard[]>(() => {
    const savedCards = localStorage.getItem("cards");
    return savedCards ? JSON.parse(savedCards) : [];
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const addEmptyCard = () => {
    setCards([...cards, { name: `Card ${cards.length + 1}`, todos: [] }]); // добаляем новую карту с пустым массивом туду к уже имеющимся картам
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-row mt-25 items-start">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-[#708993] w-[272px] rounded-xl flex flex-col p-3 ml-10"
        >
          {editingIndex === index ? (
            <input
              value={editingNaming}
              onChange={(e) => setEditingNaming(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editingNaming.trim() === "") {
                    return;
                  } else {
                    const updatedCards = [...cards];
                    updatedCards[index].name = editingNaming;
                    setCards(updatedCards);
                  }
                  setEditingIndex(null);
                }
              }}
              autoFocus
              className="text-lg font-medium font-sans text-black bg-white rounded px-2"
            />
          ) : (
            <div className="flex flex-row justify-between">
              <span
                onDoubleClick={() => {
                  setEditingIndex(index);
                  setEditingNaming(cards[index].name);
                }}
              >
                <h2 className="text-lg font-medium font-sans text-black">
                  {cards[index].name}
                </h2>
              </span>
              <button onClick={() => deleteCard(index)}>
                <RemoveIcon className="text-black ml-2 cursor-pointer hover:text-red-800 transform scale-120 hover:scale-140 transition-transform duration-500" />
              </button>
            </div>
          )}
          <Card
            card={card.todos}
            setCard={(newTodos) => {
              const updatedCards = [...cards];
              const resolvedTodos =
                typeof newTodos === "function"
                  ? newTodos(updatedCards[index].todos) // добавляем новую туду к уже имеющимся списку
                  : newTodos; // или добавляем целый массив сразу
              updatedCards[index].todos = resolvedTodos;
              setCards(updatedCards);
            }}
          />
        </div>
      ))}

      <div
        onClick={addEmptyCard}
        className="bg-[#708993] w-40 h-12 rounded-xl text-lg flex items-center justify-center hover:animate-pulse cursor-pointer active:scale-95 transition-all ml-10"
      >
        <button className="mr-2">Add a card</button>
        <AddCardIcon />
      </div>
    </div>
  );
}
