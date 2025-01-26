import express from "express";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import cors from "cors";

const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY;

const app = express();
app.use(bodyParser.json());

const corsOptions = {
  origin: "https://iwaswondering.netlify.app/",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

sgMail.setApiKey(SEND_GRID_API_KEY);

app.post("/api/yes", async (req, res) => {
  const { email } = req.body;

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address.");
  }

  const msg = {
    to: email,
    from: "hrushikesh.joshi.187@gmail.com",
    subject: "Crush Clicked Yes!",
    text: "Crush clicked 'Yes' on the webpage. bale bale!",
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
  const msg = {
    to: email,
    from: "hrushikesh.joshi.187@gmail.com",
    subject: "Crush Clicked No!",
    text: "You got rejected by Crush. Suck it up Loser!",
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
