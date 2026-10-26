import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./shared/styles/index.css";
import App from "./app/App.tsx";
import { SharedProvider } from "./app/providers/SharedProvider.tsx";

// localStorage.clear();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SharedProvider>
      <App />
    </SharedProvider>
  </StrictMode>
);
