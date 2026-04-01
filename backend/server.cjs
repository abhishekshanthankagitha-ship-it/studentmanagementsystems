const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Store OTP temporarily
let otpStore = {};

// 🔹 SEND OTP
app.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  otpStore[phone] = otp;

  console.log(`OTP for ${phone}: ${otp}`); // You can see OTP in terminal

  res.json({ success: true });
});

// 🔹 VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (otpStore[phone] && otpStore[phone] == otp) {
    delete otpStore[phone]; // remove after success
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: "Invalid OTP" });
  }
});

// 🔹 START SERVER
app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});