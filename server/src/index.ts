import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const GMAIL_ACCOUNTS = [
  {
    user: process.env.ASKYOURCRUSHOUTONLINE0_GMAIL,
    pass: process.env.ASKYOURCRUSHOUTONLINE0_GMAIL_APP_PASSWORD,
  },
  {
    user: process.env.ASKYOURCRUSHOUTONLINE1_GMAIL,
    pass: process.env.ASKYOURCRUSHOUTONLINE1_GMAIL_APP_PASSWORD,
  },
];

const MAX_EMAILS_PER_DAY = 500;
const MAX_EMAILS_PER_MINUTE = 20;
const ALERT_THRESHOLD = 0.75;

let emailCounters = GMAIL_ACCOUNTS.map(() => 0);
let emailQueue: { email: string; subject: string; text: string }[] = [];

const port: number = parseInt(process.env.PORT || "3000", 10);

const app: Express = express();

app.use(bodyParser.json());

app.use(helmet());

const corsOptions = {
  origin: "https://iwaswondering.netlify.app",
  // origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const transporterPool = GMAIL_ACCOUNTS.map((account) =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: account.user,
      pass: account.pass,
    },
  })
);

const sendAlertEmail = async (message: string): Promise<void> => {
  const alertTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ASKYOURCRUSHOUTONLINE0_GMAIL,
      pass: process.env.ASKYOURCRUSHOUTONLINE0_GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ASKYOURCRUSHOUTONLINE0_GMAIL,
    to: process.env.ALERT_EMAIL,
    subject: "Email Usage Alert",
    text: message,
  };

  try {
    await alertTransporter.sendMail(mailOptions);
    console.log("Alert email sent successfully.");
  } catch (error) {
    console.error("Failed to send alert email:", error);
  }
};

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<void> => {
  const availableAccountIndex = emailCounters.findIndex(
    (count) => count < MAX_EMAILS_PER_DAY
  );

  if (availableAccountIndex === -1) {
    throw new Error("Daily email limit reached for all accounts.");
  }

  const transporter = transporterPool[availableAccountIndex];

  const mailOptions = {
    from: GMAIL_ACCOUNTS[availableAccountIndex].user,
    to: email,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    emailCounters[availableAccountIndex]++;
    console.log(
      `Email sent using account ${availableAccountIndex}: %s`,
      info.messageId
    );
    const currentUsage = emailCounters[availableAccountIndex];
    if (currentUsage / MAX_EMAILS_PER_DAY >= ALERT_THRESHOLD) {
      sendAlertEmail(
        `Account ${GMAIL_ACCOUNTS[availableAccountIndex].user} has reached ${Math.round(
          (currentUsage / MAX_EMAILS_PER_DAY) * 100
        )}% of its daily email capacity.`
      ).catch((error) =>
        console.error("Error sending usage alert email:", error)
      );
    }
  } catch (error) {
    console.error(
      `Error sending email with account ${availableAccountIndex}:`,
      error
    );
    throw error;
  }
};

const processEmailQueue = () => {
  if (emailQueue.length === 0) return;

  const { email, subject, text } = emailQueue.shift()!;

  sendEmail(email, subject, text).catch((error) => {
    console.error("Failed to process email queue:", error);
  });
};

setInterval(() => {
  for (let i = 0; i < MAX_EMAILS_PER_MINUTE; i++) {
    processEmailQueue();
  }
}, 60000);

app.post("/api/yes", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  console.log("sending email to ", email);

  if (!isValidEmail(email)) {
    res.status(400).send("Invalid email address.");
    return;
  }

  emailQueue.push({
    email,
    subject: "Crush Clicked Yes!",
    text: "Well, well, well! Someone just clicked 'Yes'—Cupid must be on fire today! 🎯❤️ Now go ahead and treat yourself to a little happy dance. Your crush is officially on board. Balle Balle! 🎉✨",
  });

  res.status(200).send("Yes response recorded and email queued.");
});

app.post("/api/no", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  console.log("sending email to ", email);

  if (!isValidEmail(email)) {
    res.status(400).send("Invalid email address.");
    return;
  }

  emailQueue.push({
    email,
    subject: "Crush Clicked No!",
    text: "Oof, the crush said 'No'—guess Cupid took the day off! 💔 But hey, chin up! Rejections build character, and now you’ve got a great story for your future TED Talk. Onward to bigger adventures (and better crushes)! 🚀😄",
  });

  res.status(200).send("No response recorded and email queued.");
});

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
