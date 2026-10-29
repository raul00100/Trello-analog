"use client";

import SearchPage from "../../features/search/components/SearchPage";
import { useSharedProvider } from "../../shared/context/useSharedProvider";

export default function SearchRoute() {
  const { setMore } = useSharedProvider();

  return (
    <div
      className="h-screen w-screen overflow-auto"
      onClick={() => setMore(false)}
    >
      <SearchPage />
    </div>
  );
}
