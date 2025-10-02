import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-5 text-white">
      <h2 className="text-2xl">Error 404 - page not found</h2>
      <Link to="/" className="text-2xl underline">
        Hoe page
      </Link>
    </div>
  );
}
