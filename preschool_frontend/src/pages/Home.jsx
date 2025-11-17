import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";
import homeicon from "../assets/preschool.jpg";
import location from "../assets/location.png";
import mail from "../assets/email.jpg";
import cll from "../assets/telephone.png";

function Home() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedNotices = JSON.parse(localStorage.getItem("commonNotices")) || [];
      setNotices(storedNotices);
    } catch (error) {
      console.error("Error loading notices:", error);
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="home-page">
      <section className="hero-section" style={{ backgroundImage: `url(${homeicon})` }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="school-name">Sigithi Pre School</span>
          </h1>
          <p className="hero-subtitle">Let's raise a quality student in a fun and safe way</p>
          <Link to="/cources" className="hero-btn">
            <span className="btn-icon">📚</span>
            Buy External Courses
          </Link>
        </div>
      </section>

      <section className="notices-section">
        <div className="section-header-2">
          <h2 className="section-title-2">
            <span className="title-icon">📢</span>
            Latest Notices
          </h2>
        </div>

        <div className="notices-container-2">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading notices...</p>
            </div>
          ) : notices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p className="empty-text">No new notices</p>
            </div>
          ) : (
            <ul className="notices-list">
              {notices.slice(0, 5).map((notice) => (
                <li key={notice.id} className="notice-item">
                  
                  <div className="notice-content">
                    {notice.image && (
                      <img src={notice.image} alt="Notice" className="notice-image-home" />
                    )}
                    <p className="notice-text">{notice.text}</p>
                    {notice.createdAt && (
                      <time className="notice-date">{formatDate(notice.createdAt)}</time>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

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
    </div>
  );
}

export default Home;
