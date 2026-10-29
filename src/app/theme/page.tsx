"use client";

import ThemeSelector from "../../features/themes/components/ThemeSelector";
import { useSharedProvider } from "../../shared/context/useSharedProvider";

export default function ThemePage() {
  const { setMore } = useSharedProvider();

  return (
    <div
      className="h-screen w-screen overflow-auto"
      onClick={() => setMore(false)}
    >
      <ThemeSelector />
    </div>
  );
}
