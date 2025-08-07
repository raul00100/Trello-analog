import React from "react";
import Card from "./card";

export default function Column() {
  return (
    <div className="bg-[#7f5f01] w-[272px] rounded-xl flex flex-col p-3 mt-25 ml-10">
      <h2 className="text-lg font-medium font-sans text-gray-100">For today</h2>
      <Card />
    </div>
  );
}
