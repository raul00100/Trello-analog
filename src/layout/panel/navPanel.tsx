import { useEffect, useRef } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import SettingsIcon from "@mui/icons-material/Settings";
import gsap from "gsap";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useMatch, Link, useParams } from "react-router-dom";
import { useSharedProvider } from "../../shared/context/useSharedProvider";
import PanelSetting from "./panelSetting";
import Switcher from "./switcher";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const divHeader =
  "w-screen relative text-white flex flex-row justify-between items-start pt-5";
const expandIcon = "lg:scale-140 lg:mr-2 mr-0.5 scale-140";
const headerStyle =
  " font-stretch-expanded transition-all text-white font-medium text-xl hover:text-gray-300 lg:ml-30 ml-8";
const buttonHeader = "flex items-center cursor-pointer ";

export default function NavPanel() {
  const { boards, more, setMore } = useSharedProvider();

  const isBoard = !!useMatch("/board/:id");
  const params = useParams();
  const savedBoardId = localStorage.getItem("boardId");
  const homeBoardId = Number(savedBoardId);
  const boardId =
    isBoard && params.id && !isNaN(Number(params.id))
      ? Number(params.id)
      : homeBoardId;

  // animation for a folding and unfolding panel
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    if (!panelRef.current) return;

    gsap.set(panelRef.current, { overflow: "hidden" });

    if (tlRef.current) tlRef.current.kill();

    if (more) {
      const height = window.innerWidth >= 1024 ? 270 : 210; // 1024px — breakpoint lg в Tailwind
      tlRef.current = gsap.to(panelRef.current, {
        height,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      tlRef.current = gsap.to(panelRef.current, {
        height: 80,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [more]);

  useEffect(() => {
    if (isBoard && params.id && !isNaN(Number(params.id))) {
      localStorage.setItem("boardId", boardId.toString());
    }
  }, [isBoard, params.id, boardId]);

  return (
    <header
      ref={panelRef}
      className="w-full bg-white/20 backdrop-blur-md border-b border-white h-65"
    >
      {/* undisclosed panel  */}
      <div className={divHeader}>
        {isBoard ? (
          <h2 className={`${headerStyle}`}>
            <button
              onClick={() => setMore((prev) => !prev)}
              className={buttonHeader}
            >
              {more ? (
                <ExpandLessIcon className={expandIcon} />
              ) : (
                <ExpandMoreIcon className={expandIcon} />
              )}
              <span className="truncate max-w-60 hidden lg:inline-block lg:h-8">
                {boards[boardId] ? boards[boardId].name : "No board"}
              </span>
            </button>
          </h2>
        ) : (
          <h2 className={`${headerStyle}`}>
            <Link to={`/board/${homeBoardId}`}>
              <button className={buttonHeader}>
                <ArrowBackIosIcon />
                <span className="hidden lg:block"> Go Home</span>
              </button>
            </Link>
          </h2>
        )}
        <h1 className="text-lg lg:text-2xl font-medium font-stretch-expanded text-white lg:absolute lg:left-1/2 lg:-translate-x-1/8">
          My trello board
        </h1>
        <button
          onClick={() => setMore((prev) => !prev)}
          className="mr-8 lg:mr-30"
        >
          <SettingsIcon
            className={`text-white lg:scale-130 cursor-pointer ${
              more ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "5s" }}
          />
        </button>
      </div>

      {/* revealed panel */}
      <div
        className={` ${divHeader} transition-opacity duration-300 justify-between ${
          more ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* board switcher */}
        {isBoard ? (
          <Switcher boardId={boardId} />
        ) : (
          <div className="flex flex-col items-center ml-17 overflow-y-auto max-h-50 w-55" />
        )}

        {/* description */}
        <div className="flex-col text-center absolute left-1/2 -translate-x-1/3 mt-2 hidden md:flex">
          <p className={`${textDec} w-100 font-mono font-medium text-lg`}>
            Trello is a web-based project management application that helps you
            organize work
          </p>
        </div>

        <PanelSetting homeBoardId={homeBoardId} />
      </div>
    </header>
  );
}
