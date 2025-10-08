import BoardType from "./pages/boardType";
import Card from "./components/card";
import Search from "./pages/search";
import ThemeSelector from "./pages/themeSelector";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Error from "./components/error404";
import { useThemes } from "./components/themesList.tsx";
import { useSharedProvider } from "./shared/context/useSharedProvider.tsx";

const divStyle = "w-screen h-screen overflow-auto";

export default function App() {
  const { boards, setMore } = useSharedProvider();
  const { currentTheme, themesOptions } = useThemes();
  const savedBoardId = localStorage.getItem("boardId");
  const homeBoardId = Number(savedBoardId);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Navigate to={`/board/${homeBoardId}`} replace />,
        },
        {
          path: "board/:id",
          element: (
            <div className={divStyle} onClick={() => setMore(false)}>
              <BoardType />
            </div>
          ),
        },
        {
          path: "theme",
          element: (
            <div className={divStyle} onClick={() => setMore(false)}>
              <ThemeSelector />
            </div>
          ),
        },
        {
          path: "search",
          element: (
            <div className={divStyle} onClick={() => setMore(false)}>
              <Search />
            </div>
          ),
        },
      ],
    },
    { path: "*", element: <Error /> },
  ]);

  if (boards.length === 0) {
    return (
      <div className="absolute inset-0 z-0 bg-black">
        <div className="flex items-center justify-center h-screen relative z-10">
          <Card />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="absolute inset-0 z-0 pointer-events-auto">
        {themesOptions.find((el) => el.name === currentTheme)?.theme}
      </div>
      <div className="relative z-10 overflow-y-hidden h-screen ">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
