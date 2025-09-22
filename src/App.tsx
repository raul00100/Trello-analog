import React from "react";
import BoardType from "./pages/boardType";
import "./index.css";
import Dither from "./styles/Dither";

export default function App() {
  return (
    <div>
      <div className="absolute inset-0 z-0" style={{ pointerEvents: "auto" }}>
        <Dither
          waveColor={[0.5, 0.5, 0.5]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
        />
      </div>
      <div className="relative z-10">
        <BoardType />
      </div>
    </div>
  );
}
