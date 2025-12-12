import React, { useEffect, useState } from "react";
import "../../../css/Feedback.css";

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);

  // Load feedbacks from localStorage
  useEffect(() => {
    const savedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbackList(savedFeedbacks);
  }, []);

  return (
    <div className="feedback-page">
      <h2 className="feedback-title">✍️User Feedback</h2>

      {feedbackList.length === 0 ? (
        <p className="no-feedback">No feedback available</p>
      ) : (
        <div className="feedback-grid">
          {feedbackList.map((fb, index) => (
            <div className="feedback-card" key={index}>
              <h3>{fb.name}</h3>
              <p><strong>Email:</strong> {fb.email}</p>
              <p><strong>Phone:</strong> {fb.phone}</p>
              <p className="message"><strong>Message:</strong> {fb.message}</p>
              <p className="time">{fb.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Feedback;
