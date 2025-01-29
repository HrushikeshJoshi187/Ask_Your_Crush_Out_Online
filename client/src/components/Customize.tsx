import { useState, useRef } from "react";
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

  const [errors, setErrors] = useState<{
    question?: string;
    victoryMessage?: string;
    defeatMessage?: string;
    email?: string;
  }>({});

  const questionRef = useRef<HTMLTextAreaElement | null>(null);
  const victoryMessageRef = useRef<HTMLTextAreaElement | null>(null);
  const defeatMessageRef = useRef<HTMLTextAreaElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  };

  const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateEnglishAndEmojis = (input: string): boolean => {
    const pattern =
      /^[\u0020-\u007E\n\u1F600-\u1F64F\u1F300-\u1F77F\u1F780-\u1F8FF\u1F900-\u1FA6F\u1F1E6-\u1F1FF\u2600-\u26FF\u200B-\u200D\uFE0F\uD83C-\uDBFF\uDC00-\uDFFF]*$/u;

    if (
      /[^\u0020-\u007E\n\u1F600-\u1F64F\u1F300-\u1F77F\u1F780-\u1F8FF\u1F900-\u1FA6F\u1F1E6-\u1F1FF\u2600-\u26FF\u200B-\u200D\uFE0F\uD83C-\uDBFF\uDC00-\uDFFF]/.test(
        input
      )
    ) {
      return false;
    }

    return pattern.test(input);
  };

  const validateInput = (): boolean => {
    const newErrors: typeof errors = {};

    if (!question.trim()) {
      newErrors.question = "Question cannot be empty.";
    } else if (!validateEnglishAndEmojis(question)) {
      newErrors.question = "Only English text and emojis are allowed.";
    } else if (question.split("\n").length > 3) {
      newErrors.question = "Question cannot exceed 3 lines.";
    }

    if (!victoryMessage.trim()) {
      newErrors.victoryMessage = "Victory message cannot be empty.";
    } else if (!validateEnglishAndEmojis(victoryMessage)) {
      newErrors.victoryMessage = "Only English text and emojis are allowed.";
    } else if (victoryMessage.split("\n").length > 4) {
      newErrors.victoryMessage = "Victory message cannot exceed 4 lines.";
    }

    if (!defeatMessage.trim()) {
      newErrors.defeatMessage = "Defeat message cannot be empty.";
    } else if (!validateEnglishAndEmojis(defeatMessage)) {
      newErrors.defeatMessage = "Only English text and emojis are allowed.";
    } else if (defeatMessage.split("\n").length > 4) {
      newErrors.defeatMessage = "Defeat message cannot exceed 4 lines.";
    }

    if (!email.trim()) {
      newErrors.email = "Email address cannot be empty.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.question) {
        questionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (newErrors.victoryMessage) {
        victoryMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (newErrors.defeatMessage) {
        defeatMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (newErrors.email) {
        emailRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (validateInput()) {
      const sanitizedQuestion = sanitizeInput(question);
      const sanitizedVictoryMessage = sanitizeInput(victoryMessage);
      const sanitizedDefeatMessage = sanitizeInput(defeatMessage);
      const sanitizedEmail = sanitizeInput(email);

      const toBase64 = (str: string): string => {
        return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
      };

      setEncodedQuestion(encodeURIComponent(toBase64(sanitizedQuestion)));
      setEncodedVictoryMessage(
        encodeURIComponent(toBase64(sanitizedVictoryMessage))
      );
      setEncodedDefeatMessage(
        encodeURIComponent(toBase64(sanitizedDefeatMessage))
      );
      setEncodedEmail(encodeURIComponent(toBase64(sanitizedEmail)));

      setErrors({});
    }
  };

  const handleCopyToClipboard = () => {
    const url = `${website_url}?q=${encodedQuestion}&v=${encodedVictoryMessage}&d=${encodedDefeatMessage}&e=${encodedEmail}`;
    navigator.clipboard.writeText(url).then(
      () => {
        alert("URL copied to clipboard!");
      },
      (err) => {
        alert("Failed to copy URL: " + err);
      }
    );
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
            ref={questionRef}
            className={`customize_textarea ${errors.question ? "invalid" : ""}`}
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            maxLength={150}
            placeholder={`e.g., Crush! 
Are you coming to the event tomorrow? 
It's near the location, around time.`}
          />
          {<span className="error_message">{errors.question}</span>}
        </div>
        <div>
          <label className="customize_label">Victory Message:</label>
          <textarea
            ref={victoryMessageRef}
            className={`customize_textarea ${
              errors.victoryMessage ? "invalid" : ""
            }`}
            rows={4}
            value={victoryMessage}
            onChange={(e) => setVictoryMessage(e.target.value)}
            required
            maxLength={200}
            placeholder={`e.g., Hurray! 🎉
See you tommorow!`}
          />
          {<span className="error_message">{errors.victoryMessage}</span>}
        </div>
        <div>
          <label className="customize_label">Defeat Message:</label>
          <textarea
            ref={defeatMessageRef}
            className={`customize_textarea ${
              errors.defeatMessage ? "invalid" : ""
            }`}
            rows={4}
            value={defeatMessage}
            onChange={(e) => setDefeatMessage(e.target.value)}
            required
            maxLength={200}
            placeholder={`e.g., Aww! 😔
Maybe next time!`}
          />
          {<span className="error_message">{errors.defeatMessage}</span>}
        </div>
        <div>
          <label className="customize_label">Email address:</label>
          <input
            ref={emailRef}
            className={`customize_input ${errors.email ? "invalid" : ""}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={`e.g., JohnDoe@gmail.com`}
            autoComplete="on"
          />
          {<span className="error_message">{errors.email}</span>}
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
              {encodedDefeatMessage}&e={encodedEmail}
            </a>
            <button
              className="copy_button"
              onClick={handleCopyToClipboard}
              aria-label="Copy URL"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  fill="#A9A9A9"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="customize_url">
            <a href="" className="customize_url_link">
              {website_url}
            </a>
            <button
              className="copy_button"
              onClick={handleCopyToClipboard}
              aria-label="Copy URL"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="currentColor"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                  fill="#A9A9A9"
                />
              </svg>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Customize;
