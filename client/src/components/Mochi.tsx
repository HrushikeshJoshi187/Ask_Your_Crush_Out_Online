import waiting from "../assets/images/waiting.gif";
import wondering from "../assets/images/wondering.gif";
import winning from "../assets/images/winning.gif";
import losing from "../assets/images/losing.gif";
import victory from "../assets/images/victory.gif";
import defeat from "../assets/images/defeat.gif";

import "./Mochi.css";

interface MochiProps {
  state: "requirement" | "question" | "decision" | "victory" | "defeat";
  mochiState: "normal" | "winning" | "losing";
}

const Mochi = ({ state, mochiState }: MochiProps): JSX.Element => {
  const preventInteraction = (e: React.MouseEvent | React.DragEvent) => {
    console.log("called");
    e.preventDefault();
  };

  return (
    <>
      {(state === "requirement" || state === "question") && (
        <img src={waiting} alt="Mochi Waiting" className="image" />
      )}

      {state === "decision" && mochiState === "normal" && (
        <img src={wondering} alt="Mochi Wondering" className="image" />
      )}

      {state === "decision" && mochiState === "winning" && (
        <img src={winning} alt="Mochi Winning" className="image" />
      )}

      {state === "decision" && mochiState === "losing" && (
        <img src={losing} alt="Mochi Losing" className="image" />
      )}

      {state === "victory" && (
        <img src={victory} alt="Mochi Victory" className="image" />
      )}

      {state === "defeat" && mochiState === "normal" && (
        <img src={defeat} alt="Mochi Defeat" className="image" />
      )}

      {state === "defeat" && mochiState === "winning" && (
        <img src={winning} alt="Mochi Winning" className="image" />
      )}
    </>
  );
};

export default Mochi;
