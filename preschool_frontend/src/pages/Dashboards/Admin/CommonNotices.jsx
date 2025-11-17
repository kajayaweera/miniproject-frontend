import React, { useState, useEffect } from "react";
import "../../../css/CommonNotices.css";

function CommonNotice() {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ text: "", image: "" });

  // Load from localStorage
  useEffect(() => {
    const storedNotices = JSON.parse(localStorage.getItem("commonNotices")) || [];
    setNotices(storedNotices);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("commonNotices", JSON.stringify(notices));
  }, [notices]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNotice({ ...newNotice, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNotice = () => {
    if (!newNotice.text.trim()) return alert("Please enter a notice!");
    const notice = { id: Date.now(), ...newNotice };
    setNotices([notice, ...notices]);
    setNewNotice({ text: "", image: "" });
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  const updateNotice = (id) => {
    const selectedNotice = notices.find((n) => n.id === id);
    const updatedText = prompt("Edit your notice:", selectedNotice.text);
    let updatedImage = selectedNotice.image;

    const changeImage = window.confirm("Do you want to change the notice image?");
    if (changeImage) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          updatedImage = reader.result;
          setNotices(
            notices.map((notice) =>
              notice.id === id
                ? { ...notice, text: updatedText || notice.text, image: updatedImage }
                : notice
            )
          );
        };
        reader.readAsDataURL(file);
      };
      fileInput.click();
    } else {
      setNotices(
        notices.map((notice) =>
          notice.id === id
            ? { ...notice, text: updatedText || notice.text }
            : notice
        )
      );
    }
  };

  return (
    <div className="notice-container">
      <h1 className="notice-title">📢 Common Notices</h1>

      {/* Add New Notice */}
      <div className="add-notice-box">
        <textarea
          value={newNotice.text}
          onChange={(e) => setNewNotice({ ...newNotice, text: e.target.value })}
          placeholder="Enter your notice here..."
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {newNotice.image && (
          <img src={newNotice.image} alt="Preview" className="preview-img" />
        )}
        <button onClick={addNotice} className="add-btn">Add Notice</button>
      </div>

      {/* Display Notices */}
      <div className="notice-list">
        {notices.length === 0 ? (
          <p className="no-notice">No notices available</p>
        ) : (
          notices.map((notice) => (
            <div key={notice.id} className="notice-card">
              {notice.image && (
                <img src={notice.image} alt="Notice" className="notice-image" />
              )}
              <p className="notice-text">{notice.text}</p>
              <div className="notice-actions">
                <button
                  onClick={() => updateNotice(notice.id)}
                  className="edit-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommonNotice;
