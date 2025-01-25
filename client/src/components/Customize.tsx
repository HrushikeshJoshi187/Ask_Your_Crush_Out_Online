import { useState } from "react";

import "./Customize.css";

const website_url = "http://localhost:5173";

const Customize = () => {
  const [question, setQuestion] = useState("");
  const [victoryMessage, setVictoryMessage] = useState("");
  const [defeatMessage, setDefeatMessage] = useState("");
  const [encodedQuestion, setEncodedQuestion] = useState("");
  const [encodedVictory, setEncodedVictory] = useState("");
  const [encodedDefeat, setEncodedDefeat] = useState("");

  const handleGenerate = () => {
    setEncodedQuestion(btoa(question));
    setEncodedVictory(btoa(victoryMessage));
    setEncodedDefeat(btoa(defeatMessage));
  };

  return (
    <div className="customize">
      <h2>Customize Your Messages</h2>
      <form>
        <div>
          <label>Question Message:</label>
          <textarea
            className="input_textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question message"
          />
        </div>
        <div>
          <label>Victory Message:</label>
          <textarea
            className="input_textarea"
            value={victoryMessage}
            onChange={(e) => setVictoryMessage(e.target.value)}
            placeholder="Enter your victory message"
          />
        </div>
        <div>
          <label>Defeat Message:</label>
          <textarea
            className="input_textarea"
            value={defeatMessage}
            onChange={(e) => setDefeatMessage(e.target.value)}
            placeholder="Enter your defeat message"
          />
        </div>
        <button
          className="customize_button"
          type="button"
          onClick={handleGenerate}
        >
          Generate Base64
        </button>
      </form>

      {encodedQuestion && (
        <div>
          Generated URL: {website_url}/?q={encodedQuestion}v={encodedVictory}d=
          {encodedDefeat}
        </div>
      )}
    </div>
  );
};

export default Customize;
