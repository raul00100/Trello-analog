import type { Board } from "../../features/boards/model/boardTypes";
import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type ContextType = {
  authStatus: "loading" | "signedOut" | "signedIn";
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  boards: Board[];
  setBoards: Dispatch<SetStateAction<Board[]>>;
  storageStatus: "loading" | "ready" | "error";
  storageError: string | null;
  retryStorage: () => void;
  more: boolean;
  setMore: Dispatch<SetStateAction<boolean>>;
  addBoard: () => void;
  searchColumn: string | undefined;
  setSearchColumn: Dispatch<SetStateAction<string | undefined>>;
};

export const SharedContext = createContext<ContextType | undefined>(undefined);
