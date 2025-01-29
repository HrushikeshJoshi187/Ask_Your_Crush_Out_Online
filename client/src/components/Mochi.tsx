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
    e.preventDefault();
  };

  const images = {
    requirement: waiting,
    question: waiting,
    decision: {
      normal: wondering,
      winning: winning,
      losing: losing,
    },
    victory: victory,
    defeat: {
      normal: defeat,
      winning: winning,
    },
  };

  const get_image = (): string | undefined => {
    if (state === "decision" || state === "defeat") {
      return (images[state] as Record<string, string>)[mochiState];
    }
    return images[state];
  };

  return (
    <img
      src={get_image()}
      alt={`Mochi ${state}`}
      className="image"
      onClick={preventInteraction}
      onDragStart={preventInteraction}
    />
  );
};

export default Mochi;
