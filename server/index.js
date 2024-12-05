const express = require("express");
const Razorpay = require("razorpay");
const paypal = require("paypal-rest-sdk");
const cors = require("cors");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Razorpay: Create Order
app.post("/order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in paise
      currency: req.body.currency,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Razorpay order");
  }
});

// Razorpay: Payment Validation
app.post("/order/validate", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({ msg: "Payment successful!" });
});

// PayPal configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // Default to sandbox, use 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

// Debugging: log credentials to ensure they are correct
console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID);
console.log('PayPal Secret:', process.env.PAYPAL_SECRET);

// PayPal: Create Order
app.post("/paypal/order", (req, res) => {
  const { amount } = req.body;

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:5000/paypal/success",
      cancel_url: "http://localhost:5000/paypal/cancel",
    },
    transactions: [
      {
        amount: {
          currency: "USD",
          total: amount,
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("PayPal order creation failed:", error);
      res.status(500).send("PayPal order creation failed");
    } else {
      const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
      res.json({ redirectUrl: approvalUrl.href });
    }
  });
});

// PayPal: Success Route
app.get("/paypal/success", (req, res) => {
  const { paymentId, PayerID } = req.query;

  const execute_payment_json = {
    payer_id: PayerID,
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error(error.response);
      res.status(500).send("Payment execution failed");
    } else {
      res.send("Payment successful!");
    }
  });
});

// PayPal: Cancel Route
app.get("/paypal/cancel", (req, res) => {
  res.send("Payment cancelled!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
