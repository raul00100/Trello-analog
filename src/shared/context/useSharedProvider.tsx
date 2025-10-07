import { useContext } from "react";
import { SharedContext } from "./sharedContext";

export const useSharedProvider = () => {
  const context = useContext(SharedContext);
  if (!context)
    throw new Error("useSharedProvider must be used within a SharedProvider");
  return context;
};
