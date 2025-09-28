import React from "react";
import Dither from "../background/Dither";
import LiquidEther from "../background/LiquidEther";
import Aurora from "../background/Aurora";
import Squares from "../background/Squares";

type ThemeSelectorProps = {
  currentTheme: string;
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
};

function getSecondMainDivClass(theme: string, target: string) {
  return [
    "flex flex-col items-center cursor-pointer backdrop-blur-md hover:scale-105 transition-all duration-300",
    theme === target ? "bg-blue-500/30" : "bg-white/20",
  ].join(" ");
}
function headerStyle(theme: string, target: string) {
  return [
    "text-xl font-semibold text-white border-2 w-100 h-10 flex justify-between items-center px-5",
    theme === target ? "border-blue-500" : "border-zinc-400",
  ].join(" ");
}
function divStyle(theme: string, target: string) {
  return [
    "border-b-2 border-x-2 w-100 h-80 flex-none z-10 ",
    theme === target ? "border-blue-500" : "border-zinc-400",
  ].join(" ");
}

export default function ThemeSelector({
  currentTheme,
  setCurrentTheme,
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-row pt-10 gap-10 ml-10 w-screen">
      <div
        className={getSecondMainDivClass(currentTheme, "Squares")}
        onClick={() => setCurrentTheme("Squares")}
      >
        <h3 className={headerStyle(currentTheme, "Squares")}>Squares</h3>
        <div className={divStyle(currentTheme, "Squares")}>
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal"
            borderColor="#fff"
            hoverFillColor="#222"
          />
        </div>
      </div>

      <div
        className={getSecondMainDivClass(currentTheme, "Aurora")}
        onClick={() => setCurrentTheme("Aurora")}
      >
        <h3 className={headerStyle(currentTheme, "Aurora")}>Aurora</h3>
        <div className={divStyle(currentTheme, "Aurora")}>
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
      </div>

      <div
        className={getSecondMainDivClass(currentTheme, "Dither")}
        onClick={() => setCurrentTheme("Dither")}
      >
        <h3 className={headerStyle(currentTheme, "Dither")}>Dither</h3>
        <div className={divStyle(currentTheme, "Dither")}>
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
      </div>

      <div
        className={getSecondMainDivClass(currentTheme, "LiquidEther")}
        onClick={() => setCurrentTheme("LiquidEther")}
      >
        <h3 className={headerStyle(currentTheme, "LiquidEther")}>
          LiquidEther
        </h3>
        <div className={divStyle(currentTheme, "LiquidEther")}>
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
        </div>
      </div>

      <div
        className={getSecondMainDivClass(currentTheme, "Black")}
        onClick={() => setCurrentTheme("Black")}
      >
        <h3 className={headerStyle(currentTheme, "Black")}>Default Black</h3>
        <div className={`${divStyle(currentTheme, "Black")} bg-black`} />
      </div>
      <div className="pr-1" />
    </div>
  );
}
