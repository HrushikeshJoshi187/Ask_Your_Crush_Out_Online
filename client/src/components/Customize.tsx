import { useState } from "react";
import DOMPurify from "dompurify";

import "./Customize.css";

const website_url = "https://iwaswondering.netlify.app";

const Customize = (): JSX.Element => {
  const [question, setQuestion] = useState<string>("");
  const [victoryMessage, setVictoryMessage] = useState<string>("");
  const [defeatMessage, setDefeatMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [encodedQuestion, setEncodedQuestion] = useState<string>("");
  const [encodedVictoryMessage, setEncodedVictoryMessage] =
    useState<string>("");
  const [encodedDefeatMessage, setEncodedDefeatMessage] = useState<string>("");
  const [encodedEmail, setEncodedEmail] = useState<string>("");

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  const handleGenerate = () => {
    const sanitizedQuestion = sanitizeInput(question);
    const sanitizedVictoryMessage = sanitizeInput(victoryMessage);
    const sanitizedDefeatMessage = sanitizeInput(defeatMessage);
    const sanitizedEmail = sanitizeInput(email);

    setEncodedQuestion(btoa(sanitizedQuestion));
    setEncodedVictoryMessage(btoa(sanitizedVictoryMessage));
    setEncodedDefeatMessage(btoa(sanitizedDefeatMessage));
    setEncodedEmail(btoa(sanitizedEmail));
  };

  return (
    <div className="customize">
      <form className="customize_form">
        <h2 className="customize_title">Customize Your Messages</h2>
        <span className="customize_span">
          Please keep the messages brief for a better experience.
          <br />
          Make sure to test the URL before sharing it.
          <br />
          Make sure you put in right email address to receive the responses.
        </span>
        <div>
          <label className="customize_label">Question:</label>
          <textarea
            className="customize_textarea"
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            maxLength={200}
            placeholder={`Crush!
Are you coming to the Event tomorrow?
It's near location, around Time
I was wondering ...`}
          />
        </div>
        <div>
          <label className="customize_label">Victory Message:</label>
          <textarea
            className="customize_textarea"
            rows={4}
            value={victoryMessage}
            onChange={(e) => setVictoryMessage(e.target.value)}
            required
            maxLength={200}
            placeholder={`Hurray! 🎉
See you tommorow!`}
          />
        </div>
        <div>
          <label className="customize_label">Defeat Message:</label>
          <textarea
            className={`customize_textarea`}
            rows={4}
            value={defeatMessage}
            onChange={(e) => setDefeatMessage(e.target.value)}
            required
            maxLength={200}
            placeholder={`Aww! 😔
Maybe next time!`}
          />
        </div>
        <div>
          <label className="customize_label">Email address:</label>
          <input
            className={`customize_input`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={`JohnDoe@gmail.com`}
          />
        </div>
        <button
          className="customize_button"
          type="button"
          onClick={handleGenerate}
        >
          Generate URL
        </button>
        {encodedQuestion && encodedDefeatMessage && encodedVictoryMessage ? (
          <div className="customize_url">
            <a
              href={`${website_url}?q=${encodedQuestion}&v=${encodedVictoryMessage}&d=${encodedDefeatMessage}&e=${encodedEmail}`}
              className="customize_url_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website_url}/?q={encodedQuestion}&v={encodedVictoryMessage}&d=
              {encodedDefeatMessage}
            </a>
          </div>
        ) : (
          <div className="customize_url">
            <a
              href={`${website_url}`}
              className="customize_url_link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {website_url}
            </a>
          </div>
        )}
      </form>
    </div>
  );
};

export default Customize;
