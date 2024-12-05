// paypalRoutes.js
const express = require("express");
const paypal = require("paypal-rest-sdk");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Set up PayPal configuration using credentials from .env
paypal.configure({
  mode: 'sandbox',  // 'sandbox' for testing, 'live' for production
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

const router = express.Router();

// Route to create payment
router.post("/create", (req, res) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: "http://localhost:5000/paypal/success",
      cancel_url: "http://localhost:5000/paypal/cancel"
    },
    transactions: [{
      amount: {
        total: req.body.amount,
        currency: "USD"
      },
      description: "Payment description"
    }]
  };

  paypal.payment.create(paymentData, function(error, payment) {
    if (error) {
      console.log(error);
      res.status(500).send("Error processing PayPal payment");
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
});

// Route to handle success
router.get("/success", (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = { payer_id: req.query.PayerID };

  paypal.payment.execute(paymentId, payerId, function(error, payment) {
    if (error) {
      console.log(error);
      res.status(500).send("Error processing PayPal success");
    } else {
      if (payment.state === "approved") {
        res.send("Payment successful");
      } else {
        res.send("Payment failed");
      }
    }
  });
});

// Route to handle cancel
router.get("/cancel", (req, res) => {
  res.send("Payment canceled");
});

module.exports = router;
