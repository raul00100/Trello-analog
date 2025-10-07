import { Link } from "react-router-dom";
import TextType from "../styles/TextType";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function Error() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center h-48 w-80 rounded-lg bg-white/10 backdrop-blur-md border-1 border-white text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="size-8 mb-3 text-yellow-300 animate-pulse"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <TextType
          text={["Error 404 - Page not found"]}
          typingSpeed={75}
          pauseDuration={5000}
          deletingSpeed={100}
          showCursor={true}
          cursorCharacter="_"
          cursorClassName={"h-[20px]"}
          loop={true}
          initialDelay={500}
        />
        <Link to="/" className="text-2xl flex items-center gap-1.5 mt-7">
          <ArrowBackIosNewIcon className="animate-pulse scale-110" />
          <span className="hover:underline hover:sclale-102 semibold ">
            Home Page
          </span>
        </Link>
      </div>
    </div>
  );
}
