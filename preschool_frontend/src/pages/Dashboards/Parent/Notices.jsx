import "../../../css/Notices.css";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Notices() {
  const location = useLocation();
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: "", message: "" });

  // Role detection
  const isStaff = location.pathname.includes("/staff/dashboard");
  const isAdmin = location.pathname.includes("/admin/dashboard");
  const isParent = location.pathname.includes("/parent/dashboard");

  // Load saved notices from localStorage
  useEffect(() => {
    const storedNotices = JSON.parse(localStorage.getItem("notices")) || [];
    setNotices(storedNotices);
  }, []);

  // Save notices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notices", JSON.stringify(notices));
  }, [notices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNotice({ ...newNotice, [name]: value });
  };

  const addNotice = () => {
    if (!newNotice.title || !newNotice.message) {
      alert("Please fill in both title and message!");
      return;
    }
    const newId = Date.now();
    setNotices([...notices, { id: newId, ...newNotice }]);
    setNewNotice({ title: "", message: "" });
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter((notice) => notice.id !== id));
  };

  const updateNotice = (id) => {
    const noticeToUpdate = notices.find((n) => n.id === id);
    const updatedTitle = prompt("Enter updated title:", noticeToUpdate.title);
    const updatedMsg = prompt("Enter updated message:", noticeToUpdate.message);
    if (updatedTitle) {
      setNotices(
        notices.map((notice) =>
          notice.id === id
            ? { ...notice, title: updatedTitle, message: updatedMsg || notice.message }
            : notice
        )
      );
    }
  };

  return (
    <div className="notices-container">
      <h1 className="notices-title">📢 Preschool Notices</h1>

      {/* Staff or Admin can add notices */}
      {(isStaff || isAdmin) && (
        <div className="add-notice-form">
          <h2>Add New Notice</h2>
          <input
            type="text"
            name="title"
            placeholder="Notice Title"
            value={newNotice.title}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Notice Message"
            value={newNotice.message}
            onChange={handleChange}
          />
          <button onClick={addNotice} className="add-btn">
            Add Notice
          </button>
        </div>
      )}

      {/* Notices List */}
      <div className="notices-list">
        {notices.length === 0 ? (
          <p className="no-notices">No notices available</p>
        ) : (
          notices.map((notice) => (
            <div className="notice-card" key={notice.id}>
              <h3>{notice.title}</h3>
              <p>{notice.message}</p>

              {/* Only staff or admin can edit/delete */}
              {(isStaff || isAdmin) && (
                <div className="notice-actions">
                  <button
                    onClick={() => updateNotice(notice.id)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNotice(notice.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notices;
