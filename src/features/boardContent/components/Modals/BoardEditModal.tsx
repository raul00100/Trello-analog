import { useEffect, useRef, useState } from "react";

import { Button } from "../../../../shared/components/ui/button";
import { Input } from "../../../../shared/components/ui/input";
import type { Board } from "../../model/boardTypes";

type BoardEditModalProps = {
  board: Board;
  isCreating: boolean;
  onSave: (name: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  onOpenColumn: (columnId: string) => void;
};

export default function BoardEditModal({
  board,
  isCreating,
  onSave,
  onDelete,
  onCancel,
  onOpenColumn,
}: BoardEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(board.name);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const input = inputRef.current;
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="board-edit-title"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      className="fixed inset-0 m-auto max-h-[90vh] w-[min(90vw,32rem)] max-w-none overflow-y-auto rounded-xl border border-zinc-600 bg-zinc-950 p-0 text-white shadow-xl backdrop:bg-black/70"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave(name.trim());
        }}
        className="flex flex-col gap-5 p-5"
      >
        <h2 id="board-edit-title" className="text-xl font-semibold">
          {isCreating ? "Create new board" : "Edit board"}
        </h2>
        <Input
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Board name"
          aria-label="Board name"
          className="border-zinc-600 bg-black text-white focus-visible:ring-white focus-visible:ring-offset-0"
        />
        {!isCreating && (
          <p className="text-sm text-zinc-400">
            Created at:{" "}
            <time dateTime={board.createdAt}>
              {new Date(board.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
          </p>
        )}
        <section className="min-h-0">
          <h3 className="mb-2 font-medium">
            Columns ({board.lists.length})
          </h3>
          {board.lists.length > 0 ? (
            <ul className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-zinc-700 p-3">
              {board.lists.map((column) => (
                <li key={column.id}>
                  <button
                    type="button"
                    onClick={() => onOpenColumn(column.id)}
                    className="w-full truncate rounded px-2 py-1 text-left text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-white"
                  >
                    {column.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-zinc-700 p-3 text-sm text-zinc-400">
              No columns in this board.
            </p>
          )}
        </section>
        <div className="flex items-center justify-between gap-3">
          {!isCreating && (
            <Button type="button" variant="destructive" onClick={onDelete}>
              Delete board
            </Button>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={name.trim() === ""}
              variant="secondary"
            >
              {isCreating ? "Create" : "Save"}
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
