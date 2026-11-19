"use client";

import { Link, useLocation } from "react-router-dom";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import type { ReactNode } from "react";

type PanelSettingProps = {
  onSignOut: () => void;
};

type SettingOption =
  | { label: string; icon: ReactNode; path: string }
  | { label: string; icon: ReactNode; onClick: () => void };

const icons = "mr-2 lg:scale-105 scale-95";

export default function PanelSetting({ onSignOut }: PanelSettingProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const settingOptions: SettingOption[] = [
    {
      label: "Home",
      icon: <HomeIcon className={icons} />,
      path: "/",
    },
    {
      label: "Theme",
      icon: <FormatPaintIcon className={icons} />,
      path: "/theme",
    },
    {
      label: "Search",
      icon: <SearchIcon className={icons} />,
      path: "/search",
    },
    {
      label: "Sign out",
      icon: <LogoutIcon className={icons} />,
      onClick: onSignOut,
    },
  ];

  const optionClassName = `font-sans font-stretch-semi-expanded antialiased lg:text-base text-sm transition-all cursor-pointer hover:underline hover:scale-105 text-zinc-300 hover:text-white hover:underline-offset-3`;
  const controlClassName =
    "flex items-center border-0 bg-transparent p-0 font-[inherit] text-[inherit] leading-[inherit]";

  return (
    <nav className="flex flex-col lg:mr-20 mr-5 min-h-30">
      <ul className="flex lg:items-center items-end flex-col text-lg font-bold lg:gap-4.5 gap-1.5 mt-2">
        {settingOptions.map((option, idx) => {
          const contents = (
            <span className="flex items-center">
              {option.icon}
              {option.label}
            </span>
          );

          return (
            <li
              key={idx}
              className={
                "path" in option && option.path === "/" && pathname === "/"
                  ? "text-sm font-sans font-stretch-semi-expanded text-white lg:text-base"
                  : `${optionClassName} ${
                      "path" in option && pathname === option.path
                        ? "underline scale-105 text-white underline-offset-3 hover:animate-pulse"
                        : ""
                    }`
              }
            >
              {"onClick" in option ? (
                <button
                  type="button"
                  onClick={option.onClick}
                  className={controlClassName}
                >
                  {contents}
                </button>
              ) : (
                <Link to={option.path} className={controlClassName}>
                  {contents}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
