import { useLocation } from "react-router-dom";

import "./Message.css";

interface MessageProps {
  state: "requirement" | "question" | "decision" | "victory" | "defeat";
}

const Message = ({ state }: MessageProps) => {
  const location = useLocation();

  const getQueryParam = (param: string): string | null => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };

  const requirementMessage = `For the best experience
    please use a mouse...
    don't worry,
    I won't chase it!`;

  const questionFromURL =
    getQueryParam("q") ??
    `Crush!
    Are you coming to the Event tomorrow?
    It's near location, around Time
    I was wondering ...`;

  const decisionMessage = `If we could go together?`;

  const victoryMessageFromURL =
    getQueryParam("v") ??
    `Hurray! 🎉
    See you tommorow!`;

  const defeatMessageFromURL =
    getQueryParam("d") ??
    `Aww! 😔
    Maybe next time!`;

  const formattedRequirementMessage = requirementMessage
    .split("\n")
    .map((part, index) => (
      <span key={index}>
        {part}
        <br />
      </span>
    ));

  const formattedQuestion = questionFromURL.split("\n").map((part, index) => (
    <span key={index}>
      {part}
      <br />
    </span>
  ));

  const formattedDecisionMessage = decisionMessage
    .split("\n")
    .map((part, index) => (
      <span key={index}>
        {part}
        <br />
      </span>
    ));

  const formattedVictoryMessage = victoryMessageFromURL
    .split("\n")
    .map((part, index) => (
      <span key={index}>
        {part}
        <br />
      </span>
    ));

  const formattedDefeatMessage = defeatMessageFromURL
    .split("\n")
    .map((part, index) => (
      <span key={index}>
        {part}
        <br />
      </span>
    ));

  return (
    <div className="message">
      {state === "requirement" && <>{formattedRequirementMessage}</>}

      {state === "question" && <>{formattedQuestion}</>}

      {state === "decision" && <>{formattedDecisionMessage}</>}

      {state === "victory" && <>{formattedVictoryMessage}</>}

      {state === "defeat" && <>{formattedDefeatMessage}</>}
    </div>
  );
};

export default Message;
