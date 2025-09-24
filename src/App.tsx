import React, { useState } from "react";
import BoardType from "./pages/boardType";
import "./index.css";
import PrismaticBurst from "./styles/PrismaticBurst";
import Dither from "./styles/Dither";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState("Dither");

  return (
    <div>
      <div className="absolute inset-0 z-0" style={{ pointerEvents: "auto" }}>
        {/* choose background */}
        {currentTheme === "Dither" && (
          <Dither
            waveColor={[0.5, 0.5, 0.5]}
            disableAnimation={false}
            enableMouseInteraction
            mouseRadius={0.3}
            colorNum={4}
            waveAmplitude={0.3}
            waveFrequency={3}
            waveSpeed={0.05}
          />
        )}

        {currentTheme === "PrismaticBurst" && (
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            rayCount={24}
            colors={["#ff007a", "#4d3dff", "#ffffff"]}
          />
        )}
        {currentTheme === "Black" && (
          <div className="bg-black w-screen h-screen" />
        )}
      </div>
      <div className="relative z-10">
        <BoardType setCurrentTheme={setCurrentTheme} />
      </div>
    </div>
  );
}
