import React, { useEffect, useRef, useState } from "react";
import "../../../css/LiveStream.css";

const LiveStream = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied or not available.");
        console.error(err);
      }
    };

    startCamera();

    // cleanup: stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="live-container">
      <h2 className="live-title">Live Classroom View</h2>
      {error ? (
        <p className="live-error">{error}</p>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="live-video"
        />
      )}
      <p className="live-note">
        Viewing your child's classroom securely in preschool time.
      </p>
    </div>
  );
};

export default LiveStream;
