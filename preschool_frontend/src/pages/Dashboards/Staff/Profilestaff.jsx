import { AppContext } from "../../../Context/AppProvider";
import "../../../css/Profilestaff.css";
import React, { useContext, useState } from "react";


const images = [
  "http://127.0.0.1:8000/images/chatura.jpg",
  "http://127.0.0.1:8000/images/kushalika.jpg",
  "http://127.0.0.1:8000/images/sandeepani.jpg"
];

const Profilestaff = () => {
  const {user , token} = useContext(AppContext)
  const [editing, setEditing] = useState(false);
  const [staffData, setStaffData] = useState({
    name: user.name,
    role: "Preschool Teacher",
    email: user.email,
    phone: user.contact_number,
    address: user.address,
    qualification: "B.Sc in Mathematics",
    experience: "5 years",
    about:
      "Passionate preschool teacher focused on nurturing creativity, kindness, and confidence in children through playful learning.",
    skills: ["Child Care", "Storytelling", "Art & Craft", "Teamwork"],
    profilePic: images[Math.floor(Math.random() * images.length)],
  });

  const [newImage, setNewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const toggleEdit = () => {
    if (editing && newImage) {
      setStaffData({ ...staffData, profilePic: newImage });
      setNewImage(null);
    }
    setEditing(!editing);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setNewImage(preview);
    }
  };

  return (
    <div className="staff-profile-container">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={newImage || staffData.profilePic}
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              console.error("Profile image failed to load:", e?.target?.src);
              e.target.onerror = null;
              e.target.src = "/images/placeholder-profile.png"; // place placeholder in React public/images
            }}
          />
          {editing && (
            <div className="upload-overlay">
              <label htmlFor="upload-photo" className="upload-btn">
                📷
              </label>
              <input
                id="upload-photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </div>
          )}
        </div>

        <div className="profile-basic-info">
          <h2>{staffData.name}</h2>
          <p>{staffData.role}</p>
        </div>

        <button className="edit-btn" onClick={toggleEdit}>
          {editing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="profile-body">
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <p>
              <strong>Email:</strong>{" "}
              {editing ? (
                <input
                  name="email"
                  value={staffData.email}
                  onChange={handleChange}
                />
              ) : (
                staffData.email
              )}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {editing ? (
                <input
                  name="phone"
                  value={staffData.phone}
                  onChange={handleChange}
                />
              ) : (
                staffData.phone
              )}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {editing ? (
                <input
                  name="address"
                  value={staffData.address}
                  onChange={handleChange}
                />
              ) : (
                staffData.address
              )}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Professional Details</h3>
          <div className="info-grid">
            <p>
              <strong>Qualification:</strong>{" "}
              {editing ? (
                <input
                  name="qualification"
                  value={staffData.qualification}
                  onChange={handleChange}
                />
              ) : (
                staffData.qualification
              )}
            </p>
            <p>
              <strong>Experience:</strong>{" "}
              {editing ? (
                <input
                  name="experience"
                  value={staffData.experience}
                  onChange={handleChange}
                />
              ) : (
                staffData.experience
              )}
            </p>
          </div>
        </div>

        <div className="profile-section">
          <h3>About</h3>
          {editing ? (
            <textarea
              name="about"
              value={staffData.about}
              onChange={handleChange}
            ></textarea>
          ) : (
            <p>{staffData.about}</p>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default Profilestaff;
