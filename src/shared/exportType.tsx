export type Todo = { id: string; text: string; done: boolean; status?: string };
export type ColumnCard = { id: string; name: string; todos: Todo[] };
export type Board = { id: string; name: string; lists: ColumnCard[] };
export type SearchHistoryItem = {
  boardId?: string;
  boardName: string;
  colName?: string;
  todoName?: string;
};
