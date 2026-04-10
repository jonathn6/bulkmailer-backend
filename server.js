import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jonathn6.ssm@gmail.com", // ⚠️ change this if using Gmail
    pass: "fjvthsoobtjqkuuf",
  },
});

app.post("/send", async (req, res) => {
  console.log("Incoming request:", req.body);

  const { recipients, subject, body } = req.body;

  try {
    for (const email of recipients) {
      await transporter.sendMail({
        from: "Heather.small_1@icloud.com",
        to: email,
        subject: subject,
        text: body,
	replyTO: "Heather.small_1@icloud.com"
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send emails" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});