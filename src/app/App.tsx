import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { useThemes } from "../features/themes/model/themeStore";
import EmptyBoardCard from "../features/boards/components/EmptyBoardCard";
import { useSharedProvider } from "../shared/context/useSharedProvider";
import { createAppRouter } from "./router";

export default function App() {
  const { boards, setMore } = useSharedProvider();
  const { currentTheme, themesOptions } = useThemes();
  const savedBoardId = localStorage.getItem("boardId");
  const homeBoardId = Number(savedBoardId);

  const router = useMemo(
    () => createAppRouter(homeBoardId, setMore),
    [homeBoardId, setMore]
  );

  if (boards.length === 0) {
    return (
      <div className="absolute inset-0 z-0 bg-black">
        <div className="flex items-center justify-center h-screen relative z-10">
          <EmptyBoardCard />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`absolute inset-0 z-0 pointer-events-auto`}>
        {themesOptions.find((el) => el.name === currentTheme)?.theme}
      </div>
      <div className={`relative z-10 overflow-y-hidden h-screen `}>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
