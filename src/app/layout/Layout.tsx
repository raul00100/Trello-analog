import NavPanel from "./panel/NavPanel";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavPanel />
      <Outlet />
    </>
  );
}
