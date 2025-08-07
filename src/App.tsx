import React from "react";
import Column from "./components/column";

export default function App() {
  return (
    <div className="bg-linear-65 from-[#473699] to-[#F797D2] min-h-screen absolute w-screen">
      <div className="w-screen absolute pb-5 bg-zinc-900/40">
        <h1 className="text-2xl font-sans text-center mt-5 text-white font-semibold ">
          My trello board
        </h1>
      </div>
      <Column />
    </div>
  );
}
