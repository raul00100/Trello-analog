export type Todo = { id: string; text: string; done: boolean; status?: string };
export type Column = { id: string; name: string; todos: Todo[] };
export type Board = { id: string; name: string; lists: Column[] };
