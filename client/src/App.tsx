import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Message from "./components/Message.tsx";
import Circles from "./components/Circles.tsx";
import Mochi from "./components/Mochi.tsx";
import Buttons from "./components/Buttons.tsx";
import Customize from "./components/Customize.tsx";
import MusicPlayer from "./components/MusicPlayer.tsx";

import "./App.css";

const App = (): JSX.Element => {
  const appRef = useRef<HTMLDivElement | null>(null);

  const [state, SetState] = useState<
    "requirement" | "question" | "decision" | "victory" | "defeat"
  >("requirement");
  const [mochiState, setMochiState] = useState<"normal" | "winning" | "losing">(
    "normal"
  );

  const changeState = (
    newState: "requirement" | "question" | "decision" | "victory" | "defeat"
  ) => {
    SetState(newState);
  };

  const changeMochiState = (newMochiState: "normal" | "winning" | "losing") => {
    setMochiState(newMochiState);
  };

  useEffect(() => {
    changeMochiState("normal");
  }, [state]);

  return (
    <BrowserRouter>
      <div className="app" ref={appRef}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Message state={state} />
                <Circles />
                <Mochi state={state} mochiState={mochiState} />
                <Buttons
                  state={state}
                  changeState={changeState}
                  changeMochiState={changeMochiState}
                  ref={appRef}
                />
                <MusicPlayer state={state} />
              </>
            }
          />
          <Route path="/customize" element={<Customize />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
