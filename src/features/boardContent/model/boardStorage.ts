import type { Board } from "./boardTypes";
import { getSupabaseClient } from "../../../shared/lib/supabaseClient";

export async function loadBoards(userId: string): Promise<Board[]> {
  const { data, error } = await getSupabaseClient()
    .from("boards")
    .select("id, name, lists, created_at")
    .eq("owner_id", userId)
    .order("position");

  if (error) throw error;

  return (data ?? []).map((board) => ({
    id: board.id,
    name: board.name,
    lists: board.lists,
    createdAt: board.created_at,
  }));
}

export async function loadBoardsOrCreateInitial(
  userId: string
): Promise<Board[]> {
  const boards = await loadBoards(userId);
  if (boards.length > 0) return boards;

  const initialBoard: Board = {
    id: `initial-${userId}`,
    name: "Board 1",
    lists: [],
    createdAt: new Date().toISOString(),
  };
  const { error } = await getSupabaseClient()
    .from("boards")
    .upsert(
      {
        id: initialBoard.id,
        owner_id: userId,
        position: 0,
        name: initialBoard.name,
        lists: initialBoard.lists,
        created_at: initialBoard.createdAt,
      },
      { onConflict: "owner_id,id" }
    );

  if (error) throw error;

  return loadBoards(userId);
}

export async function saveBoards(
  boards: Board[],
  userId: string
): Promise<void> {
  const supabase = getSupabaseClient();
  const { data: existingBoards, error: existingBoardsError } = await supabase
    .from("boards")
    .select("id")
    .eq("owner_id", userId);

  if (existingBoardsError) throw existingBoardsError;

  if (boards.length > 0) {
    const { error } = await supabase.from("boards").upsert(
      boards.map((board, position) => ({
        id: board.id,
        owner_id: userId,
        position,
        name: board.name,
        lists: board.lists,
        created_at: board.createdAt,
      })),
      { onConflict: "owner_id,id" }
    );

    if (error) throw error;
  }

  const boardIds = new Set(boards.map((board) => board.id));
  const removedIds = (existingBoards ?? [])
    .map((board) => board.id)
    .filter((id) => !boardIds.has(id));
  if (removedIds.length === 0) return;

  const { error } = await supabase
    .from("boards")
    .delete()
    .eq("owner_id", userId)
    .in("id", removedIds);
  if (error) throw error;
}
