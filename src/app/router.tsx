import type { Dispatch, SetStateAction } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import BoardPage from "../features/boards/components/BoardPage";
import SearchPage from "../features/search/components/SearchPage";
import ThemeSelector from "../features/themes/components/ThemeSelector";
import Error404 from "../shared/components/Error404";
import Layout from "./layout/Layout";

const pageStyle = "w-screen h-screen overflow-auto";

export function createAppRouter(
  homeBoardId: number,
  setMore: Dispatch<SetStateAction<boolean>>
) {
  return createBrowserRouter([
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
            <div className={pageStyle} onClick={() => setMore(false)}>
              <BoardPage />
            </div>
          ),
        },
        {
          path: "theme",
          element: (
            <div className={pageStyle} onClick={() => setMore(false)}>
              <ThemeSelector />
            </div>
          ),
        },
        {
          path: "search",
          element: (
            <div className={pageStyle} onClick={() => setMore(false)}>
              <SearchPage />
            </div>
          ),
        },
      ],
    },
    { path: "*", element: <Error404 /> },
  ]);
}
