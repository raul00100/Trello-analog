"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HomeIcon from "@mui/icons-material/Home";
//components and context
import { useSharedProvider } from "../../shared/context/useSharedProvider";
import PanelSetting from "./PanelSetting";

const textDec =
  " flex font-sans font-stretch-semi-expanded text-white antialiased";
const divHeader =
  "w-screen relative text-white flex flex-row justify-between items-start pt-5";
const expandIcon = "scale-125 lg:size-6";
const headerStyle =
  " font-stretch-expanded transition-all text-white font-medium text-xl hover:text-gray-300 lg:ml-25 ml-8";
const buttonHeader = "flex items-center cursor-pointer ";

export default function NavPanel() {
  const { boards, more, setMore, setSearchColumn, signOut } =
    useSharedProvider();
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const pathname = location.pathname;
  const isBoard = pathname.startsWith("/board/");
  const isHome = pathname === "/";
  const [lastBoardId, setLastBoardId] = useState<number | null>(null);
  const routeBoardId = isBoard
    ? Number(pathname.match(/^\/board\/([^/]+)/)?.[1])
    : null;
  const validRouteBoardId =
    routeBoardId !== null &&
    Number.isSafeInteger(routeBoardId) &&
    routeBoardId >= 0
      ? routeBoardId
      : null;
  const boardId = validRouteBoardId ?? lastBoardId ?? 0;
  const selectedBoard = lastBoardId !== null ? boards[lastBoardId] : undefined;
  const returnToBoard = !isBoard && !isHome && selectedBoard;
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  };

  // animation for a folding and unfolding panel
  const panelRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const previousMoreRef = useRef(more);
  const initialPanelHeight = useRef(
    more ? (window.innerWidth >= 1024 ? 270 : 210) : 80,
  );

  useEffect(() => {
    const savedBoardId = Number(localStorage.getItem("boardId"));
    if (Number.isSafeInteger(savedBoardId) && savedBoardId >= 0) {
      setLastBoardId(savedBoardId);
    }
  }, []);

  useEffect(() => {
    if (!isHome) return;
    localStorage.removeItem("boardId");
    setLastBoardId(null);
  }, [isHome]);

  useEffect(() => {
    if (!panelRef.current) return;

    gsap.set(panelRef.current, { overflow: "hidden" });

    if (previousMoreRef.current === more) return;
    previousMoreRef.current = more;

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
    if (isBoard && validRouteBoardId !== null) {
      localStorage.setItem("boardId", validRouteBoardId.toString());
      setLastBoardId(validRouteBoardId);
    }
  }, [isBoard, validRouteBoardId]);

  return (
    <header
      ref={panelRef}
      className="w-full bg-white/20 backdrop-blur-md border-b border-white"
      style={{ height: initialPanelHeight.current }}
      onClick={() => setSearchColumn(undefined)}
    >
      <div className={divHeader}>
        {isBoard ? (
          <div className={`${headerStyle} flex items-center`}>
            <button
              onClick={() => setMore((prev) => !prev)}
              className={buttonHeader}
            >
              <motion.span
                initial={false}
                animate={{
                  rotate: more ? 180 : 0,
                  scale: more ? 1.05 : 1,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mr-1 inline-flex size-6 shrink-0 items-center justify-center lg:mr-2"
              >
                <ExpandMoreIcon className={expandIcon} />
              </motion.span>
              <h2 className="truncate max-w-60 hidden lg:inline-block lg:h-8">
                {boards[boardId] ? boards[boardId].name : "No board"}
              </h2>
            </button>
          </div>
        ) : isHome ? (
          <div className="font-stretch-expanded text-xl font-medium text-white lg:ml-25 ml-8">
            <div className="flex items-center" aria-current="page">
              <HomeIcon className="mr-2" />
              <span className="hidden lg:block">Home</span>
            </div>
          </div>
        ) : returnToBoard ? (
          <div className={`${headerStyle}`}>
            <Link to={`/board/${boardId}`} className={buttonHeader}>
              <ArrowBackIosIcon />
              <span className="hidden lg:block">
                Go back to {selectedBoard.name}
              </span>
            </Link>
          </div>
        ) : boards.length > 0 && !isHome ? (
          <div className={`${headerStyle}`}>
            <Link to="/" className={buttonHeader}>
              <ArrowBackIosIcon />
              <span className="hidden lg:block">Home</span>
            </Link>
          </div>
        ) : (
          <div className={headerStyle} />
        )}

        <h1 className="text-lg lg:text-2xl font-medium font-stretch-expanded text-white lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          Management Tool
        </h1>

        <div className="mr-5 lg:mr-25">
          <button onClick={() => setMore((prev) => !prev)}>
            <SettingsIcon
              className={`text-white lg:scale-130 cursor-pointer ${
                more ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "5s" }}
            />
          </button>
        </div>
      </div>

      {/* revealed panel */}
      <div
        className={` ${divHeader} transition-opacity duration-300 justify-between ${
          more ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* home navigation */}
        <div className="flex w-50 flex-col items-center lg:ml-20">
          {(isBoard || returnToBoard) && (
            <Link
              to="/"
              onClick={() => setMore(false)}
              className="mt-2 flex w-35 items-center justify-center rounded border border-white/50 py-1.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black active:scale-95 lg:w-40 lg:text-base"
            >
              <ArrowBackIosIcon className="mr-2 scale-75" />
              Go Home
            </Link>
          )}
        </div>

        {/* description */}
        <div className="flex-col text-center absolute left-1/2 -translate-x-1/2 mt-2 hidden md:flex">
          <p className={`${textDec} w-100 font-mono font-medium text-lg`}>
            A web-based project management tool that helps you organize work
          </p>
        </div>

        <PanelSetting onSignOut={() => void handleSignOut()} />
      </div>
    </header>
  );
}
