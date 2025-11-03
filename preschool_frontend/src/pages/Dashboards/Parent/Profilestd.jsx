import "../../../css/Profilestd.css";
import React, { useState } from "react";

function ChildProfile() {
  const [childData, setChildData] = useState({
    name: "Ashoka Perera",
    age: 4,
    grade: "Pre-KG",
    photo: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    parentName: "Mrs. Nadeesha Perera",
    attendance: "95%",
    health: "Good",
    mood: "Happy 😊",
    behavior: "Friendly and Active",
    learningProgress: "Excellent progress in writing and counting",
    activities: ["Drawing", "Music", "Story Time", "Outdoor Play"],
  });

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  // 📸 File Upload Handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setChildData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
        setIsEditingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  //  URL Upload Handler
  const handlePhotoUrlChange = () => {
    if (photoUrl.trim() === "") {
      alert("Please enter a valid URL");
      return;
    }
    setChildData((prev) => ({
      ...prev,
      photo: photoUrl,
    }));
    setPhotoUrl("");
    setIsEditingPhoto(false);
  };

  const child = childData;

  return (
    <div className="child-profile-wrapper">
      <div className="child-profile-container">
        <div className="profile-header">
          <h1 className="page-title">Child Profile</h1>
        </div>

        <div className="profile-content">
          {/* LEFT COLUMN */}
          <div className="profile-card">
            <div className="profile-photo-wrapper">
              <img
                src={child.photo}
                alt={`${child.name}'s profile`}
                className="profile-photo"
              />
              {/*  Edit button */}
              <button
                className="edit-photo-btn"
                onClick={() => setIsEditingPhoto(true)}
              >
                📷
              </button>
            </div>

            <h2 className="child-name">{child.name}</h2>

            <div className="child-basic-info">
              
              <div className="info-badge">
                <span className="badge-label">Age</span>
                <span className="badge-value">{child.age} years</span>
              </div>
            </div>

            <div className="parent-info">
              <p className="parent-label">Parent/Guardian</p>
              <p className="parent-name">{child.parentName}</p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="profile-details-wrapper">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <p className="stat-label">Attendance</p>
                  <p className="stat-value">{child.attendance}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">😊</div>
                <div className="stat-content">
                  <p className="stat-label">Mood</p>
                  <p className="stat-value">{child.mood}</p>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Behavioral Overview</h3>
              <div className="detail-card">
                <p className="detail-text">{child.behavior}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Learning Progress</h3>
              <div className="detail-card">
                <p className="detail-text">{child.learningProgress}</p>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Recent Activities</h3>
              <div className="activities-grid">
                {child.activities.map((activity, index) => (
                  <div key={index} className="activity-chip">
                    <span className="activity-icon">✨</span>
                    {activity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🖼️ PHOTO UPLOAD MODAL */}
        {isEditingPhoto && (
          <div className="photo-modal-overlay">
            <div className="photo-modal">
              <h2 className="modal-title">Change Profile Photo</h2>

              <div className="photo-option-section">
                <label className="photo-option-label">Upload from Device</label>
                <input
                  type="file"
                  id="photoUpload"
                  className="photo-file-input"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photoUpload" className="photo-upload-btn">
                  Choose Image
                </label>
              </div>

              <div className="photo-divider">
                <span>OR</span>
              </div>

              <div className="photo-option-section">
                <label className="photo-option-label">
                  Enter Image URL
                </label>
                <input
                  type="text"
                  className="photo-url-input"
                  placeholder="Paste image URL here"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
                <button
                  className="photo-submit-btn"
                  onClick={handlePhotoUrlChange}
                >
                  Use This Photo
                </button>
              </div>

              <button
                className="photo-cancel-btn"
                onClick={() => setIsEditingPhoto(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChildProfile;
