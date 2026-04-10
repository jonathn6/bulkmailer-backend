import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
  console.log("File name:", req.body.fileName);
console.log("File data exists:", !!req.body.fileData);
console.log("File data length:", req.body.fileData?.length);
  console.log("Incoming request:", req.body);

  const { recipients, subject, body, fileName, fileData } = req.body;

  try {
    for (const email of recipients) {
      await transporter.sendMail({
        from: "Heather.Small_1@icloud.com",
        to: email,
        bcc: "Heather.Small_1@icloud.com",
        subject: subject,
        text: body,
        replyTo: "Heather.Small_1@icloud.com",

        // 👇 ADD THIS BLOCK
        attachments: fileData
          ? [
              {
                filename: fileName || "attachment.pdf",
                content: Buffer.from(fileData, "base64"),
              },
            ]
          : [],
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack,
    });
  }
});

// ✅ FIXED for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
