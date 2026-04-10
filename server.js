import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ iCloud SMTP transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mail.me.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send", async (req, res) => {
  console.log("Incoming request:", req.body);

  const { recipients, subject, body } = req.body;

  try {
    for (const email of recipients) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        bcc: process.env.EMAIL_USER, // ✅ you wanted this
        subject: subject,
        text: body,
        replyTo: process.env.EMAIL_USER,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

// ✅ FIXED for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});