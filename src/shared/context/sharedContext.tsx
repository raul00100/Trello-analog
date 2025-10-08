import type { Board } from "../exportType";
import { createContext } from "react";

type ContextType = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  addBoard: () => void;
  searchColumn: string | undefined;
  setSearchColumn: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const SharedContext = createContext<ContextType | undefined>(undefined);
