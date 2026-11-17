import { useEffect, useRef, useState } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Input } from "../../../shared/components/ui/input";
import type { Column } from "../model/boardTypes";

type ColumnEditModalProps = {
  column: Column;
  onSave: (name: string) => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function ColumnEditModal({
  column,
  onSave,
  onDelete,
  onCancel,
}: ColumnEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(column.name);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="column-edit-title"
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
        <h2 id="column-edit-title" className="text-xl font-semibold">
          Edit column
        </h2>
        <Input
          autoFocus
          aria-label="Column name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border-zinc-600 bg-black text-white focus-visible:ring-white focus-visible:ring-offset-0"
        />
        <section aria-labelledby="column-todos-title" className="min-h-0">
          <h3 id="column-todos-title" className="mb-2 font-medium">
            Todos ({column.todos.length})
          </h3>
          {column.todos.length > 0 ? (
            <ul className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-zinc-700 p-3">
              {column.todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex min-w-0 items-start gap-2 text-sm"
                >
                  <span
                    aria-label={todo.done ? "Completed" : "Not completed"}
                    className="shrink-0"
                  >
                    {todo.done ? "✓" : "○"}
                  </span>
                  <span
                    className={`min-w-0 whitespace-pre-wrap break-words ${
                      todo.done ? "text-zinc-400 line-through" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-zinc-700 p-3 text-sm text-zinc-400">
              No todos in this column.
            </p>
          )}
        </section>
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete column
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={name.trim() === ""}
              variant="secondary"
            >
              Save
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
