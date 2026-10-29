"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const savedBoardId = localStorage.getItem("boardId");
    router.replace(`/board/${savedBoardId ?? 0}`);
  }, [router]);

  return null;
}
