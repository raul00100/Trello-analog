export type Todo = { text: string; done: boolean };
export type ColumnCard = { id: string; name: string; todos: Todo[] };
export type Board = { name: string; lists: ColumnCard[] };
