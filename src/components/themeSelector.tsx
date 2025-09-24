import React from "react";
import PrismaticBurst from "../styles/PrismaticBurst";
import Dither from "../styles/Dither";

type ThemeSelectorProps = {
  setCurrentTheme: React.Dispatch<React.SetStateAction<string>>;
};

const divStyle = "border-zinc-400 border-b-2 border-x-2 w-100 h-80 flex-none";
const headerStyle =
  "text-xl font-semibold text-white border-2 border-zinc-400 w-100 h-10 flex justify-center items-center";
const secondMainDiv =
  "flex flex-col items-center cursor-pointer backdrop-blur-md bg-white/20";

export default function ThemeSelector({ setCurrentTheme }: ThemeSelectorProps) {
  return (
    <div className="flex flex-row pt-10 gap-10 mx-10 w-screen">
      <div className={secondMainDiv} onClick={() => setCurrentTheme("Dither")}>
        <h1 className={headerStyle}>Dither</h1>
        <div className={divStyle}>
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
        className={secondMainDiv}
        onClick={() => setCurrentTheme("PrismaticBurst")}
      >
        <h1 className={headerStyle}>PrismaticBurst</h1>
        <div className={`${divStyle} z-10`}>
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={1.0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={24}
            mixBlendMode="lighten"
            colors={["#ff007a", "#4d3dff", "#ffffff"]}
          />
        </div>
      </div>

      <div className={secondMainDiv} onClick={() => setCurrentTheme("Black")}>
        <h1 className={headerStyle}>Default Black</h1>
        <div className={`${divStyle} bg-black`} />
      </div>
    </div>
  );
}
