"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSharedProvider } from "../shared/context/useSharedProvider";

export default function HomePage() {
  const router = useRouter();
  const { authStatus } = useSharedProvider();

  useEffect(() => {
    if (authStatus !== "signedIn") return;
    const savedBoardId = localStorage.getItem("boardId");
    router.replace(`/board/${savedBoardId ?? 0}`);
  }, [authStatus, router]);

  return null;
}
