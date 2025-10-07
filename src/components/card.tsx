import "../styles/card.css";
import QueueIcon from "@mui/icons-material/Queue";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSharedProvider } from "../shared/context/useSharedProvider";

export default function Card() {
  const { addBoard } = useSharedProvider();
  return (
    <div className="card">
      <div className="align">
        <span className="red"></span>
        <span className="yellow"></span>
        <span className="green"></span>
      </div>

      <h1>
        Are you here for the<span className="font-bold"> first time </span> ?
      </h1>
      <div className="flex flex-col items-center gap-1.5 text-white">
        <p className="mt-9 font-medium">Add your first board !</p>
        <ArrowDownwardIcon className="animate-bounce" />

        <button onClick={addBoard} className="cursor-pointer">
          <QueueIcon className="scale-110" />
        </button>
      </div>
    </div>
  );
}
