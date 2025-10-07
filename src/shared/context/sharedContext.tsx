import type { Board } from "../../components/exportType";
import { createContext } from "react";

type ContextType = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  addBoard: () => void;
};

export const SharedContext = createContext<ContextType | undefined>(undefined);
