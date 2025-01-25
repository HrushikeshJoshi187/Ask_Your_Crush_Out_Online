import { useRef, forwardRef } from "react";

import "./Buttons.css";

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

    console.log(appRef);

    const getRandomNumber = (min: number, max: number): number => {
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber;
    };

    const moveButton = () => {
      const noButton = noButtonRef.current;
      const app =
        (appRef as React.MutableRefObject<HTMLDivElement | null>)?.current ??
        null;

      console.log(appRef);

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
              className="button"
              onClick={() => {
                changeState("victory");
              }}
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
                onClick={() => {
                  changeState("defeat");
                }}
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
            onClick={() => {
              changeState("victory");
            }}
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
