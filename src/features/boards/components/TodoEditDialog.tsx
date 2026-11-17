import { useEffect, useRef } from "react";
import { Button } from "../../../shared/components/ui/button";
import { Textarea } from "../../../shared/components/ui/textarea";

type TodoEditDialogProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function TodoEditDialog({
  value,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: TodoEditDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="todo-edit-title"
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
          onSave();
        }}
        className="flex flex-col gap-5 p-5"
      >
        <h2 id="todo-edit-title" className="text-xl font-semibold">
          Edit todo
        </h2>
        <Textarea
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-32 resize-y border-zinc-600 bg-black text-white focus-visible:ring-white focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between gap-3">
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={value.trim() === ""}
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
