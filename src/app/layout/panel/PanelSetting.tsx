"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import type { ReactNode } from "react";

type PanelSettingProps = {
  homeBoardId: number;
  onSignOut: () => void;
};

type SettingOption =
  | { label: string; icon: ReactNode; path: string }
  | { label: string; icon: ReactNode; onClick: () => void };

const icons = "mr-2 lg:scale-105 scale-95";

export default function PanelSetting({
  homeBoardId,
  onSignOut,
}: PanelSettingProps) {
  const pathname = usePathname();

  const settingOptions: SettingOption[] = [
    {
      label: "Home",
      icon: <HomeIcon className={icons} />,
      path: `/board/${homeBoardId}`,
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
    <nav className="flex flex-col lg:mr-20 mr-5">
      <ul className="flex items-start flex-col text-lg font-bold gap-4.5 mt-2">
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
              className={`${optionClassName} ${
                "path" in option && pathname === option.path
                  ? "underline scale-105 text-white underline-offset-3 hover:animate-pulse"
                  : ""
              }`}
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
                <Link href={option.path} className={controlClassName}>
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
