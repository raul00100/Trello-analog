import { useEffect, useState } from "react";
import BoardType from "./pages/boardType";
import "./index.css";
import Dither from "./background/Dither";
import LiquidEther from "./background/LiquidEther";
import Aurora from "./background/Aurora";
import Squares from "./background/Squares";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "Aurora";
  });

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  });

  return (
    <div>
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {/* choose background */}
        {currentTheme === "Squares" && (
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal" // up, down, left, right, diagonal
            borderColor="#fff"
            hoverFillColor="#222"
          />
        )}

        {currentTheme === "Aurora" && (
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        )}

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

        {currentTheme === "LiquidEther" && (
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        )}
        {currentTheme === "Black" && (
          <div className="bg-black w-screen h-screen" />
        )}
      </div>
      <div className="relative z-10">
        <BoardType
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />
      </div>
    </div>
  );
}
// add more themes
//add history of deleted todos
//made an archive
//maybe add an importance level
// and maybe add a deadline ( no bruh )
