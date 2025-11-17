import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../css/Checkout.css";
import { AppContext } from "../../../Context/AppProvider";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], facilityFee = 0, total = 0 } = location.state || {};
  const {user , token} = useContext(AppContext)

  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
      if (formattedValue.replace(/\s/g, "").length > 16) return;
    } else if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2");
      if (formattedValue.replace(/\//g, "").length > 4) return;
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 3) return;
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Card holder name is required";
    }
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date (MM/YY)";
    }
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      try {
        const paymentData = {
          user_id: user.id,
          courses: cart.map(course => ({
            course_name: course.name,
            amount: course.price
          })),
          total_amount: total,
          status: 'completed'
        };

        const response = await axios.post('http://localhost:8000/api/payments', paymentData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        alert("Payment Successful! 🎉");
        navigate("/parent/dashboard");
      } catch (error) {
        console.error('Payment error:', error);
        const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-header">
          <h1>Secure Checkout</h1>
          <p>Complete your payment for Sigithi Preschool</p>
        </div>

        <div className="checkout-body">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.map((course) => (
                <div key={course.id} className="summary-item">
                  <span>{course.name}</span>
                  <span>Rs.{course.price}</span>
                </div>
              ))}
              <div className="summary-item">
                <span>Facility & Service Fees</span>
                <span>Rs.{facilityFee}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>Rs.{total}</span>
              </div>
            </div>
          </div>

          <div className="payment-form">
            <h2>Payment Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={errors.cardNumber ? "error" : ""}
                />
                {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
              </div>

              <div className="form-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="cardHolder"
                  placeholder="John Doe"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  className={errors.cardHolder ? "error" : ""}
                />
                {errors.cardHolder && <span className="error-msg">{errors.cardHolder}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={errors.expiryDate ? "error" : ""}
                  />
                  {errors.expiryDate && <span className="error-msg">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    className={errors.cvv ? "error" : ""}
                  />
                  {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                  ← Back
                </button>
                <button type="submit" className="pay-btn" disabled={loading}>
                  {loading ? 'Processing...' : `Pay Rs.${total} 💳`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;