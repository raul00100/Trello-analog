import NavPanel from "../layout/navPanel";
import { Outlet } from "react-router-dom";
import type { GeneralProp } from "../layout/navPanel";

export default function Layout(props: GeneralProp) {
  return (
    <>
      <NavPanel {...props} />
      <Outlet />
    </>
  );
}
