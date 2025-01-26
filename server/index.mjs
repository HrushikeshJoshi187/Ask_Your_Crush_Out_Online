import express from "express";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;

const app = express();
app.use(bodyParser.json());

app.use(helmet());

const corsOptions = {
  origin: "https://iwaswondering.netlify.app",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

sgMail.setApiKey(SEND_GRID_API_KEY);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

app.post("/api/yes", async (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address.");
  }

  const msg = {
    to: email,
    from: "hrushikesh.joshi.187@gmail.com",
    subject: "Crush Clicked Yes!",
    text: "Well, well, well! Someone just clicked 'Yes'—Cupid must be on fire today! 🎯❤️ Now go ahead and treat yourself to a little happy dance. Your crush is officially on board. Bale Bale! 🎉✨",
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent:", response);
    res.status(200).send("Yes response recorded and email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/api/no", async (req, res) => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address.");
  }

  const msg = {
    to: email,
    from: "hrushikesh.joshi.187@gmail.com",
    subject: "Crush Clicked No!",
    text: "Oof, the crush said 'No'—guess Cupid took the day off! 💔 But hey, chin up! Rejections build character, and now you’ve got a great story for your future TED Talk. Onward to bigger adventures (and better crushes)! 🚀😄",
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent:", response);
    res.status(200).send("No response recorded and email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Failed to send email");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
