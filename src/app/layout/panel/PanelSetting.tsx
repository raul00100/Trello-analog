import { Link, useLocation } from "react-router-dom";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";

type PanelSettingProps = {
  homeBoardId: number;
};

const icons = "mr-2 lg:scale-105 scale-95";

export default function PanelSetting({ homeBoardId }: PanelSettingProps) {
  const location = useLocation();

  const settingOptions = [
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
  ];
  return (
    <nav className="flex flex-col lg:mr-20 mr-5">
      <ul className="flex items-start flex-col text-lg font-bold gap-4.5 mt-2">
        {settingOptions.map((option, idx) => {
          return (
            <li
              key={idx}
              className={`font-sans font-stretch-semi-expanded antialiased lg:text-lg text-sm transition-all cursor-pointer 
                      ${
                        location.pathname === option.path
                          ? " underline scale-105 text-white underline-offset-3 hover:animate-pulse"
                          : " hover:underline hover:scale-105 text-zinc-300 hover:text-white hover:underline-offset-3"
                      }
                        `}
            >
              <Link to={option.path}>
                <span className="flex items-center ">
                  {option.icon}
                  {option.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
