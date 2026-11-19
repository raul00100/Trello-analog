import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "../../../../shared/components/ui/button";
import { Textarea } from "../../../../shared/components/ui/textarea";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type TodoEditModalProps = {
  value: string;
  createdAt: string;
  lastModifiedAt?: string;
  completedAt?: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function TodoEditModal({
  value,
  createdAt,
  lastModifiedAt,
  completedAt,
  onChange,
  onSave,
  onDelete,
  onCancel,
}: TodoEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const textarea = textareaRef.current;
    textarea?.focus();
    textarea?.setSelectionRange(textarea.value.length, textarea.value.length);
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
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
        className="flex flex-col p-5"
      >
        <h2 id="todo-edit-title" className="text-xl font-semibold mb-5">
          Edit todo
        </h2>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-32 mb-5 resize-y border-zinc-600 bg-black text-white focus-visible:ring-white focus-visible:ring-offset-0"
        />

        {(createdAt || lastModifiedAt || completedAt) && (
          <div className="mb-5 flex flex-col gap-2">
            {createdAt && (
              <div className="flex items-center">
                <p className="text-sm text-zinc-400">
                  Created at{" "}
                  <time dateTime={createdAt}>
                    {new Date(createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </time>
                </p>
                {(lastModifiedAt || completedAt) && (
                  <button
                    type="button"
                    onClick={() => setShowTimestamp((visible) => !visible)}
                    className="ml-1 inline-flex cursor-pointer rounded-sm p-0.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        rotate: showTimestamp ? 180 : 0,
                        scale: showTimestamp ? 1.05 : 1,
                      }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex"
                    >
                      <ExpandMoreIcon />
                    </motion.span>
                  </button>
                )}
              </div>
            )}

            <motion.div
              initial={false}
              animate={{
                gridTemplateRows: showTimestamp ? "1fr" : "0fr",
                opacity: showTimestamp ? 1 : 0,
              }}
              transition={{
                gridTemplateRows: {
                  duration: reduceMotion ? 0 : 0.38,
                  ease: [0.16, 1, 0.3, 1],
                },
                opacity: {
                  duration: reduceMotion ? 0 : 0.2,
                  ease: "easeOut",
                },
              }}
              className="grid overflow-hidden"
            >
              <div className="min-h-0 overflow-hidden">
                <div className="flex flex-col gap-2 border-l border-zinc-800 pl-3 mb-2">
                  {lastModifiedAt && (
                    <p className="text-sm text-zinc-400">
                      Last modified{" "}
                      <time dateTime={lastModifiedAt}>
                        {new Date(lastModifiedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </p>
                  )}
                  {completedAt && (
                    <p className="text-sm text-zinc-400">
                      Completed at{" "}
                      <time dateTime={completedAt}>
                        {new Date(completedAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </time>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

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
