import type { Board } from "./boardTypes";

type StoredBoard = Omit<Board, "id"> & { id?: string };

const BOARD_STORAGE_KEY = "board";

export function loadBoards(): Board[] {
  const savedBoards = localStorage.getItem(BOARD_STORAGE_KEY);
  if (!savedBoards || savedBoards === "undefined") return [];

  const storedBoards: StoredBoard[] = JSON.parse(savedBoards);
  return storedBoards.map((board) => ({
    ...board,
    id: board.id || crypto.randomUUID(),
  }));
}

export function saveBoards(boards: Board[]): void {
  localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boards));
}
