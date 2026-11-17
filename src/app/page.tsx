"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSharedProvider } from "../shared/context/useSharedProvider";

export default function HomePage() {
  const navigate = useNavigate();
  const { authStatus, boards } = useSharedProvider();

  useEffect(() => {
    if (authStatus !== "signedIn" || boards.length === 0) return;
    const savedBoardId = localStorage.getItem("boardId");
    navigate(`/board/${savedBoardId ?? 0}`, { replace: true });
  }, [authStatus, boards.length, navigate]);

  return null;
}
