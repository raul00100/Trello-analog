"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSharedProvider } from "../shared/context/useSharedProvider";

export default function HomePage() {
  const router = useRouter();
  const { authStatus, boards } = useSharedProvider();

  useEffect(() => {
    if (authStatus !== "signedIn" || boards.length === 0) return;
    const savedBoardId = localStorage.getItem("boardId");
    router.replace(`/board/${savedBoardId ?? 0}`);
  }, [authStatus, boards.length, router]);

  return null;
}
