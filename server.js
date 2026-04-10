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

transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP VERIFY ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

app.post("/send", async (req, res) => {
  console.log("Incoming request:", req.body);
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

  const { recipients, subject, body } = req.body;

  try {
    for (const email of recipients) {
      await transporter.sendMail({
        from: "Heather.Small_1@icloud.com",
        to: email,
        bcc: process.env.EMAIL_USER, // ✅ you wanted this
        subject: subject,
        text: body,
        replyTo: "Heather.Small_1@icloud.com",
      });
    }

    res.json({ success: true });
  } catch (error) {
  res.status(500).json({
    message: error.message,
    code: error.code,
    response: error.response,
    stack: error.stack, // optional but helpful for debugging
  });
}
});

app.post("/test", (req, res) => {
  console.log("BODY:", req.body);
  res.json({ received: req.body });
});

// ✅ FIXED for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
