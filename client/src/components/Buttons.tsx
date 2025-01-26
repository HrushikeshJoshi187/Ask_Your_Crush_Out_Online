import { useRef, forwardRef, useMemo } from "react";
import DOMPurify from "dompurify";

import "./Buttons.css";

const serverURL = "https://ask-your-crush-out-online.onrender.com";

interface ButtonsProps {
  state: "requirement" | "question" | "decision" | "victory" | "defeat";
  changeState: (
    newState: "requirement" | "question" | "decision" | "victory" | "defeat"
  ) => void;
  changeMochiState: (newMochiState: "normal" | "winning" | "losing") => void;
}

const Buttons = forwardRef<HTMLDivElement, ButtonsProps>(
  ({ state, changeState, changeMochiState }, appRef) => {
    const noButtonRef = useRef<HTMLButtonElement>(null);

    const getRandomNumber = (min: number, max: number): number => {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber;
    };

    const moveButton = (): void => {
      const noButton = noButtonRef.current;
      const app = (appRef as React.RefObject<HTMLDivElement>)?.current;

      if (!app) {
        console.error("appRef is not attached to a valid DOM element.");
        return;
      }

      if (!app || !noButton) return;

      const appRect = app.getBoundingClientRect();
      const buttonRect = noButton.getBoundingClientRect();

      const buttonHeight = buttonRect.height;
      const buttonWidth = buttonRect.width;

      const minDistance = 50;
      const maxDistance = 150;
      const maxRetries = 10;
      let retries = 0;

      const initialTop = buttonRect.top - appRect.top;
      const initialLeft = buttonRect.left - appRect.left;

      let newTop = buttonRect.top;
      let newLeft = buttonRect.left;

      do {
        const moveTop = getRandomNumber(-maxDistance, maxDistance);
        const moveLeft = getRandomNumber(-maxDistance, maxDistance);

        newTop = buttonRect.top + moveTop;
        newLeft = buttonRect.left + moveLeft;

        newTop = Math.max(
          appRect.top,
          Math.min(newTop, appRect.bottom - buttonHeight)
        );
        newLeft = Math.max(
          appRect.left,
          Math.min(newLeft, appRect.right - buttonWidth)
        );

        retries++;
      } while (
        (Math.abs(newTop - buttonRect.top) < minDistance ||
          Math.abs(newLeft - buttonRect.left) < minDistance) &&
        retries < maxRetries
      );

      noButton.style.position = "absolute";

      noButton.style.top = initialTop + "px";
      noButton.style.left = initialLeft + "px";

      noButton.offsetHeight;

      noButton.style.top = Math.max(0, newTop - appRect.top) + "px";
      noButton.style.left = Math.max(0, newLeft - appRect.left) + "px";
    };

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

    const emailFromURL = useMemo(() => {
      const queryParam = getQueryParam("e");
      return queryParam
        ? safeAtobAndSanitize(queryParam)
        : `hrushi.joshi.187@gmail.com`;
    }, [location.search]);

    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const handleYesClick = (): void => {
      if (!isValidEmail(emailFromURL)) {
        console.error("Invalid email format.");
        return;
      }

      changeState("victory");
      fetch(`${serverURL}/api/yes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailFromURL }),
      });
    };

    const handleNoClick = (): void => {
      if (!isValidEmail(emailFromURL)) {
        console.error("Invalid email format.");
        return;
      }

      changeState("defeat");
      fetch(`${serverURL}/api/no`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailFromURL }),
      });
    };

    return (
      <div className="buttons">
        {state === "requirement" && (
          <button
            className="button"
            onClick={() => {
              changeState("question");
            }}
          >
            Caught One? All set?
          </button>
        )}

        {state === "question" && (
          <button
            className="button"
            onClick={() => {
              changeState("decision");
            }}
          >
            If ...
          </button>
        )}

        {state === "decision" && (
          <>
            <button
              className="button yesbutton"
              onClick={handleYesClick}
              onMouseOver={() => {
                changeMochiState("winning");
              }}
              onMouseLeave={() => {
                changeMochiState("normal");
              }}
            >
              Yes
            </button>
            <div id="nobuttonplaceholder" className="nobuttonplaceholder">
              <button
                ref={noButtonRef}
                className="button nobutton"
                onClick={handleNoClick}
                onMouseOver={() => {
                  changeMochiState("losing");
                  moveButton();
                }}
                onMouseLeave={() => {
                  changeMochiState("normal");
                }}
              >
                No
              </button>
            </div>
          </>
        )}

        {state === "defeat" && (
          <button
            className="button"
            onClick={handleYesClick}
            onMouseOver={() => {
              changeMochiState("winning");
            }}
            onMouseLeave={() => {
              changeMochiState("normal");
            }}
          >
            Still want to go out?
          </button>
        )}
      </div>
    );
  }
);

export default Buttons;
