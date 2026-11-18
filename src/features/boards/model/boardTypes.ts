export type Todo = {
  id: string;
  text: string;
  done: boolean;
  status?: string;
  createdAt: string;
  lastModifiedAt?: string;
  completedAt?: string;
};
export type Column = {
  id: string;
  name: string;
  todos: Todo[];
  createdAt?: string;
};
export type Board = { id: string; name: string; lists: Column[] };
