import React from "react";
import "../../../css/LiveStream.css";

const LiveStream = () => {
  // Suppose this is the live video URL from your backend or media server
  const videoUrl = "https://yourserver.com/live/classroom1.m3u8";

  return (
    <div className="live-container">
      <h2 className="live-title">Live Classroom View</h2>
      <video controls autoPlay muted className="live-video">
        <source src={videoUrl} type="application/x-mpegURL" />
        Your browser does not support live streaming.
      </video>
      <p className="live-note">
        Viewing your child’s classroom securely in real-time.
      </p>
    </div>
  );
};

export default LiveStream;
