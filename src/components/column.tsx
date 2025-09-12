import React from "react";
import Card from "./card";
import AddCardIcon from "@mui/icons-material/AddCard";

export default function Column() {
  return (
    <div className="flex flex-row gap-10 mt-25">
      <div className="bg-[#708993] w-[272px] rounded-xl flex flex-col p-3 ml-10">
        <h2 className="text-lg font-medium font-sans text-black">For today</h2>
        <Card />
      </div>

      <div className="bg-[#708993] px-7 h-12 rounded-xl text-lg flex items-center hover:animate-pulse cursor-pointer active:scale-95 transition-all">
        <button className="mr-2">Add a card</button>
        <AddCardIcon />
      </div>
    </div>
  );
}
