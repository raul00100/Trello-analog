import React from "react";
import ColumnList from "./components/columnList";
import "./index.css";

export default function App() {
  return (
    <div className="bg-linear-65 bg-[#19183B]">
      <div className="w-screen absolute pb-5 bg-gray-600">
        <h1 className="text-2xl ml-20 mt-5 text-white font-medium font-stretch-expanded">
          My trello board
        </h1>
      </div>
      <div className="overflow-x-auto h-screen">
        <ColumnList />
      </div>
    </div>
  );
}
