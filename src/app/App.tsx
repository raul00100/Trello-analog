"use client";

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useThemes } from "../features/themes/model/themeStore";
import AuthPage from "../features/auth/components/AuthPage";
import { useSharedProvider } from "../shared/context/useSharedProvider";
import Error404 from "../shared/components/Error404";
import NavPanel from "./layout/panel/NavPanel";
import HomePage from "./page";
import BoardRoute from "./board/[id]/page";
import SearchRoute from "./search/page";
import ThemePage from "./theme/page";

export default function App() {
  const { authStatus, storageStatus, storageError, retryStorage } =
    useSharedProvider();
  const { currentTheme, themesOptions } = useThemes();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) useThemes.setState({ currentTheme: savedTheme });
  }, []);

  if (storageStatus === "error" && authStatus !== "signedIn") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p>Could not connect to your cloud storage.</p>
        <p className="max-w-2xl text-sm text-red-200">{storageError}</p>
        <button
          className="rounded border border-white px-4 py-2 hover:bg-white/20"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Checking your account...
      </div>
    );
  }

  if (authStatus === "signedOut") {
    return <AuthPage />;
  }

  if (storageStatus === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading your boards...
      </div>
    );
  }

  if (storageStatus === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <p>Could not connect to your cloud storage.</p>
        <p className="max-w-2xl text-sm text-red-200">{storageError}</p>
        <button
          className="rounded border border-white px-4 py-2 hover:bg-white/20"
          onClick={retryStorage}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="pointer-events-auto absolute inset-0 z-0">
        {themesOptions.find((el) => el.name === currentTheme)?.theme}
      </div>
      <div className="relative z-10 h-screen overflow-y-hidden">
        <NavPanel />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/board/:id" element={<BoardRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="/theme" element={<ThemePage />} />
          <Route path="/404" element={<Error404 />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {storageError && (
        <div
          role="alert"
          className="fixed bottom-3 right-3 z-50 rounded bg-red-950/90 px-4 py-2 text-sm text-white"
        >
          Could not save changes: {storageError}
        </div>
      )}
    </div>
  );
}
