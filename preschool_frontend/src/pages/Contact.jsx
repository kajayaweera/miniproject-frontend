import React, { useState } from "react";
import "../css/Contact.css";
import location from "../assets/location.png";
import mail from "../assets/email.jpg";
import cll from "../assets/telephone.png";
import bdy from "../assets/contactpage.png";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill required fields (Name, Email, Message)");
      return;
    }

    const oldFeedback = JSON.parse(localStorage.getItem("feedbacks")) || [];

    const newFeedback = {
      ...form,
      time: new Date().toLocaleString(),
    };

    localStorage.setItem("feedbacks", JSON.stringify([...oldFeedback, newFeedback]));

    alert("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="bkgrd" style={{ backgroundImage: `url(${bdy})` }}>
      <div>
        <h2 className="contct-topic">📞Contact us</h2>
        <div className="cntct">
          <div className="con-item">
            <img src={location} className="icon" alt="location" /><br />
            <label>Visit us</label><br />
            <label>567/A, Colombo Road, Eheliyagoda</label>
          </div>

          <div className="con-item">
            <img src={cll} className="icon" alt="phone" /><br />
            <label>Let's talk</label><br />
            <label>011 2345678</label>
          </div>

          <div className="con-item">
            <img src={mail} className="icon" alt="email" /><br />
            <label>Email us</label><br />
            <label>Sigithi@gmail.com</label>
          </div>
        </div>
      </div>

      <div className="contact-form-container">
        <div className="contact_form">
          <label className="tpc">We'd love to hear from you...</label><br />

          <input
            placeholder="Your name"
            className="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          /><br />

          <input
            placeholder="Your email"
            className="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          /><br />

          <input
            placeholder="Your phone number"
            className="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          /><br />

          <textarea
            placeholder="Message"
            className="text_con"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          ></textarea><br />

          <button className="con_btn" onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
