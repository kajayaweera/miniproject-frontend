import React, { useRef } from "react";
import { useCart } from "../../../Context/CartContext";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../../css/Billing.css";

function Billing() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const billRef = useRef(null);

  const facilityFee = 1500;
  const total = cart.reduce((sum, item) => sum + item.price, 0) + facilityFee;

  const downloadPDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Preschool_Bill.pdf");
  };

  const handlePayNow = () => {
    navigate("/checkout", { state: { cart, facilityFee, total } });
  };

  return (
    <div className="billing-container">
      <h1 className="billing-title">Preschool Payment Summary</h1>

      <div ref={billRef} className="bill-section">
        <div className="school-header">
          <h2>  Sigithi Preschool</h2>
          <p>Monthly Activities & Facilities Billing</p>
        </div>

        <div className="bill">
        <div className="selected-courses">
          <h3>Selected Courses</h3>
          {cart.length === 0 ? (
            <p className="empty">No courses selected.</p>
          ) : (
            <ul>
              {cart.map((course) => (
                <li key={course.id}>
                  <span>{course.name}</span>
                  <span>Rs.{course.price}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bill-summary">
          <table>
            <tbody>
              <tr>
                <td>Facility & Service Fees</td>
                <td>Rs.{facilityFee}</td>
              </tr>
              {cart.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>Rs.{course.price}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td><strong>Total</strong></td>
                <td><strong>Rs.{total}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>


        <div className="thankyou-note">
          <p>Thank you for enrolling your child in our programs! 💖</p>
          <p>We look forward to a fun-filled learning experience together!</p>
        </div>
      </div>

      <div className="billing-actions">
        <button className="download-btn" onClick={downloadPDF}>📥 Download Bill PDF</button>
        <button className="pay-btn" onClick={handlePayNow}>💳 Pay Now</button>
      </div>
    </div>
  );
}

export default Billing;

