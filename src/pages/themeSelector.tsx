import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useThemes } from "../components/themesList.tsx";

export default function ThemeSelector() {
  const { themesOptions, currentTheme, setCurrentTheme } = useThemes();

  const location = useLocation();
  if (!themesOptions || themesOptions.length === 0)
    return (
      <p className="text-2xl text-white flex items-center justify-center z-20 h-screen w-screen">
        No themes found
      </p>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ul className="flex lg:flex-row flex-col lg:pt-10 pt-5 lg:gap-10 gap-5 lg:ml-10 justify-center items-center lg:justify-between lg:items-start">
          {themesOptions.map((element) => (
            <li
              key={element.name}
              className={`flex flex-col items-center cursor-pointer backdrop-blur-md hover:scale-105 transition-all duration-300 ${
                currentTheme === element.name ? "bg-blue-500/30" : "bg-white/20"
              }`}
              onClick={() =>
                setCurrentTheme ? setCurrentTheme(element.name) : null
              }
            >
              <h3
                className={`lg:text-xl text-base font-semibold text-white border-2 lg:w-100 w-60 h-7 lg:h-10 flex justify-between items-center px-5 ${
                  currentTheme === element.name
                    ? "border-blue-500"
                    : "border-zinc-400"
                }`}
              >
                {element.name}
              </h3>
              <div
                className={`border-b-2 border-x-2 lg:w-100 w-60 lg:h-80 h-60 flex-none z-10 ${
                  currentTheme === element.name
                    ? "border-blue-500"
                    : "border-zinc-400"
                }`}
              >
                {element.theme}
              </div>
            </li>
          ))}
          <div className="w-1 h-20 flex-none z-10 " />
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
