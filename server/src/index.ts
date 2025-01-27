import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL =
  process.env.SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL;
const BREVO_API_KEY = process.env.BREVO_API_KEY;

console.log(
  "SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL",
  SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL
);
console.log("BREVO_API_KEY", BREVO_API_KEY);

const port: number = parseInt(process.env.PORT || "3000", 10);

const app: Express = express();

app.use(bodyParser.json());

app.use(helmet());

const corsOptions = {
  // origin: "https://iwaswondering.netlify.app",
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

if (SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL)
  sgMail.setApiKey(SEND_GRID_API_KEY_HRUSHIKESHJOSHI187_GMAIL);

const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = brevoClient.authentications["api-key"];
if (BREVO_API_KEY) apiKey.apiKey = BREVO_API_KEY;

const emailProviders = ["sendgrid", "brevo"];
let currentProviderIndex = 0;

let sendGridCount = 0;
let brevoCount = 0;

const SENDGRID_LIMIT = 100;
const BREVO_LIMIT = 300;

const getNextProvider = () => {
  const provider = emailProviders[currentProviderIndex];
  console.log(`Current provider index: ${currentProviderIndex}`);
  console.log(`Current provider: ${provider}`);
  currentProviderIndex = (currentProviderIndex + 1) % emailProviders.length;
  return provider;
};

const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<void> => {
  let provider = getNextProvider();
  console.log(`Using ${provider} for email sending`);

  if (provider === "sendgrid" && sendGridCount >= SENDGRID_LIMIT) {
    console.log("SendGrid daily limit reached, switching to Brevo.");
    provider = getNextProvider();
  }

  if (provider === "brevo" && brevoCount >= BREVO_LIMIT) {
    console.log("Brevo daily limit reached, switching to SendGrid.");
    provider = getNextProvider();
  }

  provider = "sendgrid";

  if (provider === "sendgrid") {
    const msg = {
      to: email,
      from: "hrushikesh.joshi.187@gmail.com",
      subject,
      text,
    };

    try {
      await sgMail.send(msg);
      sendGridCount++;
      console.log(`Email sent to ${email} via SendGrid`);
    } catch (error) {
      console.error("SendGrid failed to send:", error);
    }
  } else if (provider === "brevo") {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = `<p>${text}</p>`;
    sendSmtpEmail.sender = { email: "askyourcrushoutonline0@yahoo.com" };
    sendSmtpEmail.to = [{ email }];

    try {
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log("Email sent via Brevo:", result);
      brevoCount++;
    } catch (error) {
      console.error("Brevo failed to send:", error);
      throw error;
    }
  }
};

app.post("/api/yes", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    res.status(400).send("Invalid email address.");
    return;
  }

  try {
    await sendEmail(
      email,
      "Crush Clicked Yes!",
      "Well, well, well! Someone just clicked 'Yes'—Cupid must be on fire today! 🎯❤️ Now go ahead and treat yourself to a little happy dance. Your crush is officially on board. Bale Bale! 🎉✨"
    );
    res.status(200).send("Yes response recorded and email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.post("/api/no", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!isValidEmail(email)) {
    res.status(400).send("Invalid email address.");
    return;
  }

  try {
    await sendEmail(
      email,
      "Crush Clicked No!",
      "Oof, the crush said 'No'—guess Cupid took the day off! 💔 But hey, chin up! Rejections build character, and now you’ve got a great story for your future TED Talk. Onward to bigger adventures (and better crushes)! 🚀😄"
    );
    res.status(200).send("No response recorded and email sent");
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send("Failed to send email");
  }
});

app.listen(port, () =>
  console.log(`[server]: Server is running at http://localhost:${port}`)
);
