export type Todo = { id: string; text: string; done: boolean; status?: string };
export type ColumnCard = { id: string; name: string; todos: Todo[] };
export type Board = { name: string; lists: ColumnCard[] };
