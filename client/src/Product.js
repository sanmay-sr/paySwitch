import React, { useState } from "react";

function Product({ name, description, price, image }) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsProcessing(true);
    try {
      if (selectedMethod === "razorpay") {
        await razorpayPayment();
      } else if (selectedMethod === "paypal") {
        await paypalPayment();
      }
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const fetchOrder = async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const razorpayPayment = async () => {
    const order = await fetchOrder("http://localhost:5000/order", {
      amount: price * 100,
      currency: "INR",
    });

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: price * 100,
      currency: "INR",
      order_id: order.id,
      name: name,
      handler: (response) => alert("Payment successful!"),
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paypalPayment = async () => {
    // Assuming 1 INR = 0.012 USD (example exchange rate)
    const conversionRate = 0.012; 
    const usdAmount = (price * conversionRate).toFixed(2); // Convert price to USD
  
    const response = await fetch("http://localhost:5000/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: usdAmount, currency: "USD" }),
    });
  
    const order = await response.json();
    window.location.href = order.redirectUrl;
  };
  


  return (
    <div className="card shadow-sm" style={{ width: "18rem" }}>
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body text-center">
        <h5 className="card-title">{name}</h5>
        <p className="card-text text-muted">{description}</p>
        <p className="text-primary fw-bold">₹{price}</p>
        <select
          className="form-select mb-3"
          onChange={(e) => setSelectedMethod(e.target.value)}
          value={selectedMethod}
        >
          <option value="">Select Payment Method</option>
          <option value="razorpay">Razorpay</option>
          <option value="paypal">PayPal</option>
        </select>
        <button
          className="btn btn-primary w-100"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default Product;
