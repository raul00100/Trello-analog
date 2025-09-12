// Column.tsx
import React, { useState, useEffect } from "react";
import Card from "./card";
import AddCardIcon from "@mui/icons-material/AddCard";
import RemoveIcon from "@mui/icons-material/Remove";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const handleDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    const { source, destination } = result;

    if (!destination) return; // если отпустили вне списка

    const newCards = [...cards]; // копируем текущие колонки

    if (source.droppableId === destination.droppableId) {
      // перетаскивание внутри одной колонки
      const colIndex = Number(source.droppableId);
      const col = newCards[colIndex];
      const [moved] = col.todos.splice(source.index, 1);
      col.todos.splice(destination.index, 0, moved);
    } else {
      // перетаскивание между колонками
      const sourceCol = newCards[Number(source.droppableId)];
      const destCol = newCards[Number(destination.droppableId)];
      const [moved] = sourceCol.todos.splice(source.index, 1);
      destCol.todos.splice(destination.index, 0, moved);
    }

    setCards(newCards);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-cards" direction="horizontal">
        {(provided) => (
          <div
            className="flex flex-row mt-25 items-start"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Draggable
                key={index}
                draggableId={`card-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    key={index}
                    className="bg-[#708993] w-[272px] rounded-xl flex flex-col p-3 ml-10"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
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
                        className="text-lg font-medium font-sans bg-gray-700 rounded px-2 focus:outline-none focus:border-blue-700 border-2 border-gray-700 text-zinc-300"
                      />
                    ) : (
                      <div className="flex flex-row justify-between">
                        <span
                          onDoubleClick={() => {
                            setEditingIndex(index);
                            setEditingNaming(cards[index].name);
                          }}
                        >
                          <h2 className="text-lg font-medium font-sans text-black cursor-pointer py-0.5">
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
                )}
              </Draggable>
            ))}

            <div
              onClick={addEmptyCard}
              className="bg-[#708993] w-40 h-12 rounded-xl text-lg flex items-center justify-center hover:animate-pulse cursor-pointer active:scale-95 transition-all ml-10"
            >
              <button className="mr-2">Add a card</button>
              <AddCardIcon />
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
