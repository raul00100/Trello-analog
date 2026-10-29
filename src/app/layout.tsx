import type { ReactNode } from "react";
import App from "./App";
import { SharedProvider } from "./providers/SharedProvider";
import "../shared/styles/index.css";

export const metadata = {
  title: "Management Tool",
  description: "A Kanban board for organizing your work.",
  icons: { icon: "/icon.jpg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SharedProvider>
          <App>{children}</App>
        </SharedProvider>
      </body>
    </html>
  );
}
