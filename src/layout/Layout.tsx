import NavPanel from "../layout/navPanel";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavPanel />
      <Outlet />
    </>
  );
}
