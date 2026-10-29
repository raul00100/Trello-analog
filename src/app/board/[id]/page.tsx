"use client";

import BoardPage from "../../../features/boards/components/BoardPage";
import { useSharedProvider } from "../../../shared/context/useSharedProvider";

export default function BoardRoute() {
  const { setMore } = useSharedProvider();

  return (
    <div
      className="h-screen w-screen overflow-auto"
      onClick={() => setMore(false)}
    >
      <BoardPage />
    </div>
  );
}
