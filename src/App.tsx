import { useState, useEffect } from "react";
import BoardType from "./pages/boardType";
// import NavPanel from "./components/navPanel";
import Card from "./components/card";
import Search from "./pages/search";
import ThemeSelector from "./pages/themeSelector";
import "./index.css";
//background
import Dither from "./background/Dither";
import LiquidEther from "./background/LiquidEther";
import Aurora from "./background/Aurora";
import Squares from "./background/Squares";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Error from "./components/error404";

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
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "Aurora";
  });
  const [more, setMore] = useState(() => {
    const savedMore = localStorage.getItem("more");
    return savedMore ? JSON.parse(savedMore) : false;
  });
  const savedBoardId = localStorage.getItem("boardId");
  const homeBoardId = Number(savedBoardId);

  const addBoard = (navigate?: (path: string) => void) => {
    // let newIndex = 0;
    if (boards.length === 0) {
      setBoards([{ name: "Board 1", lists: [] }]);
    } else {
      setBoards([...boards, { name: "", lists: [] }]);
    }
    if (navigate) navigate(`/board/${boards.length}`);
  };

  useEffect(() => {
    localStorage.setItem("board", JSON.stringify(boards));
  }, [boards]);
  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);
  useEffect(() => {
    localStorage.setItem("more", JSON.stringify(more));
  }, [more]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          boards={boards}
          setBoards={setBoards}
          addBoard={addBoard}
          more={more}
          setMore={setMore}
        />
      ),
      children: [
        {
          index: true,
          element: <Navigate to={`/board/${homeBoardId}`} replace />,
        },
        {
          path: "board/:id",
          element: (
            <div
              className="overflow-x-auto h-screen w-screen"
              onClick={() => setMore(false)}
            >
              <BoardType boards={boards} setBoards={setBoards} />
            </div>
          ),
        },
        {
          path: "theme",
          element: (
            <div
              className="overflow-x-auto h-screen w-screen"
              onClick={() => setMore(false)}
            >
              <ThemeSelector
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
              />
            </div>
          ),
        },
        {
          path: "search",
          element: (
            <div
              className="h-screen w-screen overflow-hidden"
              onClick={() => setMore(false)}
            >
              <Search boards={boards} />
            </div>
          ),
        },
      ],
    },
    { path: "*", element: <Error /> },
  ]);

  if (boards.length === 0) {
    return (
      <div>
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
        </div>
        <div className="flex items-center justify-center h-screen relative z-10">
          <Card addBoard={addBoard} />
        </div>
      </div>
    );
  }

  return (
    <div>
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
      <div className="relative z-10 overflow-y-hidden h-screen ">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

//сократить код ✅
//добавить анимацию ✅
//сделать роутер для поиска✅
//проработать мемоизацию
//оптимизировать под моб устройства
//проработать дизайн настроек в нав панели - хом не работает ✅
//избавиться от currentBoard и перейти на navlink ✅
