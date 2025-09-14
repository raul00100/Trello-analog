// Column.tsx
import React, { useState, useEffect } from "react";
import Column from "./column";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import RemoveIcon from "@mui/icons-material/Remove";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type Todo = { text: string; done: boolean };
type ColumnCard = { name: string; todos: Todo[] };

type ColumnListProps = {
  columns: ColumnCard[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnCard[]>>;
};

export default function ColumnList({ columns, setColumns }: ColumnListProps) {
  // Use columns directly as source of truth
  const cards = columns;
  const setCards = setColumns;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingNaming, setEditingNaming] = useState("");

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  const addEmptyCard = () => {
    setCards([...cards, { name: `Card ${cards.length + 1}`, todos: [] }]);
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleOnDragEnd = (result: import("@hello-pangea/dnd").DropResult) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  return (
    <div className=" mt-10 flex flex-row">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-row items-start"
            >
              {cards.map((card, index) => (
                <Draggable
                  key={index}
                  draggableId={String(index)}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-[#708993] w-[272px] rounded-xl flex flex-col p-3 ml-10"
                    >
                      {editingIndex === index ? (
                        <input
                          value={editingNaming}
                          onChange={(e) => setEditingNaming(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (editingNaming.trim() === "") return;
                              const updatedCards = [...cards];
                              updatedCards[index].name = editingNaming;
                              setCards(updatedCards);
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
                            <h2 className="text-base font-medium font-sans text-black cursor-pointer py-0.5 mb-2">
                              {cards[index].name}
                            </h2>
                          </span>
                          <button onClick={() => deleteCard(index)}>
                            <RemoveIcon className="text-black ml-2 cursor-pointer hover:text-rose-700 transform scale-120 hover:scale-140 transition-transform duration-500" />
                          </button>
                        </div>
                      )}
                      <Column
                        card={card.todos}
                        setCard={(newTodos) => {
                          const updatedCards = [...cards];
                          const resolvedTodos =
                            typeof newTodos === "function"
                              ? newTodos(updatedCards[index].todos)
                              : newTodos;
                          updatedCards[index].todos = resolvedTodos;
                          setCards(updatedCards);
                        }}
                      />
                      <div
                        className="flex justify-center rotate-90 cursor-grab"
                        {...provided.dragHandleProps}
                      >
                        <DragIndicatorIcon />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              <div
                onClick={addEmptyCard}
                className="bg-blue-900 active:bg-blue-800 text-white w-40 h-11 rounded-lg text-base flex items-center justify-center hover:animate-pulse cursor-pointer active:scale-95 transition-all ml-10 mr-10 flex-none"
              >
                <button className="mr-2">Add a column</button>
                <AssignmentAddIcon />
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

//добавить движение в бок ✅
// добавить возможность создавать новые доски
