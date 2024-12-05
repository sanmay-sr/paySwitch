const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const dotenv = require("dotenv");
const paypalRoutes = require("../paypalRoutes"); // PayPal routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Use PayPal routes
app.use("/paypal", paypalRoutes);

// Razorpay order route and validation (already implemented in your code)

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
