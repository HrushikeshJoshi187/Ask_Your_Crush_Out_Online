import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

import "./Message.css";

interface MessageProps {
  state: "requirement" | "question" | "decision" | "victory" | "defeat";
}

const Message = ({ state }: MessageProps): JSX.Element => {
  const location = useLocation();

  const getQueryParam = (param: string): string | null => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(param);
  };

  const safeAtobAndSanitize = (input: string): string => {
    try {
      const decoded = atob(input);
      return DOMPurify.sanitize(decoded);
    } catch {
      return "";
    }
  };

  const formatMessage = (message: string): JSX.Element[] =>
    message.split("\n").map((part, index) => (
      <span key={index}>
        {part}
        <br />
      </span>
    ));

  const requirementMessage = `For the best experience
    please use a mouse ...
    don't worry,
    I won't chase it!`;

  const questionFromURL = useMemo(() => {
    const queryParam = getQueryParam("q");
    return queryParam
      ? safeAtobAndSanitize(queryParam) +
          `
      I was wondering ...`
      : `Crush!
    Are you coming to the Event tomorrow?
    It's near location, around Time
    I was wondering ...`;
  }, [location.search]);

  const decisionMessage = `If we could go together?`;

  const victoryMessageFromURL = useMemo(() => {
    const queryParam = getQueryParam("v");
    return queryParam
      ? safeAtobAndSanitize(queryParam)
      : `Hurray! 🎉
  See you tomorrow!`;
  }, [location.search]);

  const defeatMessageFromURL = useMemo(() => {
    const queryParam = getQueryParam("d");
    return queryParam
      ? safeAtobAndSanitize(queryParam)
      : `Aww! 😔
  Maybe next time!`;
  }, [location.search]);

  return (
    <div className="message">
      {state === "requirement" && <>{formatMessage(requirementMessage)}</>}

      {state === "question" && <>{formatMessage(questionFromURL)}</>}

      {state === "decision" && <>{formatMessage(decisionMessage)}</>}

      {state === "victory" && <>{formatMessage(victoryMessageFromURL)}</>}

      {state === "defeat" && <>{formatMessage(defeatMessageFromURL)}</>}
    </div>
  );
};

export default Message;
