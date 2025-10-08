import NavPanel from "./panel/navPanel";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavPanel />
      <Outlet />
    </>
  );
}
