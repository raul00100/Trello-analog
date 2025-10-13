import Dither from "../background/Dither";
import LiquidEther from "../background/LiquidEther";
import Aurora from "../background/Aurora";
import Squares from "../background/Squares";
import { create } from "zustand";
import type { JSX } from "react";

type ThemeStore = {
  themesOptions: Array<{
    name: string;
    theme: JSX.Element;
  }>;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
};

//use zustand to manage themes as using context causes unnecessary re-renders
export const useThemes = create<ThemeStore>((set) => ({
  currentTheme: localStorage.getItem("theme") || "Aurora",
  setCurrentTheme: (theme) => {
    set({ currentTheme: theme });
    localStorage.setItem("theme", theme);
  },

  themesOptions: [
    {
      name: "Dither",
      theme: (
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
      ),
    },
    {
      name: "LiquidEther",
      theme: (
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
      ),
    },
    {
      name: "Aurora",
      theme: (
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      ),
    },
    {
      name: "Squares",
      theme: (
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
        />
      ),
    },
  ],
}));
