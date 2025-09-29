import { useState, useEffect } from "react";
import BoardType from "./pages/boardType";
import NavPanel from "./components/navPanel";
import Card from "./components/card";
import Search from "./pages/search";
import ThemeSelector from "./pages/themeSelector";
import "./index.css";
//background
import Dither from "./background/Dither";
import LiquidEther from "./background/LiquidEther";
import Aurora from "./background/Aurora";
import Squares from "./background/Squares";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

type Todo = { text: string; done: boolean };
type ColumnCard = { id: string; name: string; todos: Todo[] };
type BoardTypeProps = {
  name: string;
  lists: ColumnCard[];
};

export default function App() {
  const [boards, setBoards] = useState<BoardTypeProps[]>(() => {
    const savedBoard = localStorage.getItem("board");
    return savedBoard ? JSON.parse(savedBoard) : [];
  });
  const [currentBoard, setCurrentBoard] = useState(() => {
    const savedCurrentBoard = localStorage.getItem("current");
    return savedCurrentBoard ? JSON.parse(savedCurrentBoard) : 0;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "Aurora";
  });
  const [more, setMore] = useState(false);

  const addBoard = () => {
    if (boards.length === 0) {
      setBoards([{ name: "Board 1", lists: [] }]);
    } else {
      setBoards([...boards, { name: "", lists: [] }]);
      setCurrentBoard(boards.length);
    }
  };

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);
  useEffect(() => {
    localStorage.setItem("current", JSON.stringify(currentBoard));
  }, [currentBoard]);
  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  if (boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white bg-white/40 backdrop-blur-md">
        <Card addBoard={addBoard} />
      </div>
    );
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <NavPanel
            boards={boards}
            setBoards={setBoards}
            currentBoard={currentBoard}
            setCurrentBoard={setCurrentBoard}
            addBoard={addBoard}
            more={more}
            setMore={setMore}
          />
          <BoardType
            boards={boards}
            setBoards={setBoards}
            currentBoard={currentBoard}
          />
        </>
      ),
    },
    {
      path: "/theme",
      element: (
        <>
          <NavPanel
            boards={boards}
            setBoards={setBoards}
            currentBoard={currentBoard}
            setCurrentBoard={setCurrentBoard}
            addBoard={addBoard}
            more={more}
            setMore={setMore}
          />
          <ThemeSelector
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        </>
      ),
    },
    {
      path: "/search",
      element: (
        <>
          <NavPanel
            boards={boards}
            setBoards={setBoards}
            currentBoard={currentBoard}
            setCurrentBoard={setCurrentBoard}
            addBoard={addBoard}
            more={more}
            setMore={setMore}
          />
          <Search boards={boards} />
        </>
      ),
    },
  ]);
  return (
    <main>
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {currentTheme === "Squares" && (
          <Squares
            speed={0.5}
            squareSize={40}
            direction="diagonal"
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
        <RouterProvider router={router} />
      </div>
    </main>
  );
}
