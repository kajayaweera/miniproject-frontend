import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../css/Updates.css";

const Updates = () => {
  const location = useLocation();
  const isStaff = location.pathname.includes("/staff/dashboard");

  // State management
  const [updates, setUpdates] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newUpdate, setNewUpdate] = useState({
    studentName: "",
    attendance: "",
    behavior: "",
    mood: "",
    health: "",
    learningProgress: "",
  });

  // Load initial data
  useEffect(() => {
    const initialUpdates = [
      {
        id: 1,
        studentName: "Emma Fernando",
        attendance: "Present",
        behavior: "Excellent",
        mood: "Happy",
        health: "Good",
        learningProgress: "Reading skills improving",
      },
      {
        id: 2,
        studentName: "Noah Perera",
        attendance: "Absent",
        behavior: "Good",
        mood: "Calm",
        health: "Fever",
        learningProgress: "Needs math practice",
      },
    ];
    setUpdates(initialUpdates);
  }, []);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validate and add new update
  const handleAddUpdate = () => {
    if (!newUpdate.studentName.trim()) {
      alert("Please enter student name");
      return;
    }

    const updatedList = [
      ...updates,
      {
        ...newUpdate,
        id: Date.now(),
      },
    ];

    setUpdates(updatedList);
    resetForm();
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewUpdate({
      studentName: "",
      attendance: "",
      behavior: "",
      mood: "",
      health: "",
      learningProgress: "",
    });
    setFormVisible(false);
  };

  // Delete update by ID
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this update?"
    );
    if (confirmDelete) {
      setUpdates(updates.filter((update) => update.id !== id));
    }
  };

  // Toggle form visibility
  const toggleForm = () => {
    setFormVisible(!formVisible);
    if (formVisible) {
      resetForm();
    }
  };

  return (
    <div className="updates-container">
      {/* Header Section */}
      <header className="updates-header">
        <h1 className="updates-title">Student Daily Updates</h1>
        {isStaff && (
          <button className="btn-toggle-form" onClick={toggleForm}>
            {formVisible ? "✕ Cancel" : "+ Add New Update"}
          </button>
        )}
      </header>

      {/* Add Update Form (Staff Only) */}
      {isStaff && formVisible && (
        <section className="update-form-section">
          <h2 className="form-title">Create New Update</h2>
          <form className="update-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="studentName">Student Name *</label>
              <input
                id="studentName"
                type="text"
                placeholder="Enter student full name"
                value={newUpdate.studentName}
                onChange={(e) =>
                  handleInputChange("studentName", e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="attendance">Attendance</label>
              <select
                id="attendance"
                value={newUpdate.attendance}
                onChange={(e) =>
                  handleInputChange("attendance", e.target.value)
                }
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="behavior">Behavior</label>
              <select
                id="behavior"
                value={newUpdate.behavior}
                onChange={(e) => handleInputChange("behavior", e.target.value)}
              >
                <option value="">Select Behavior</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Improvement">Needs Improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mood">Mood</label>
              <select
                id="mood"
                value={newUpdate.mood}
                onChange={(e) => handleInputChange("mood", e.target.value)}
              >
                <option value="">Select Mood</option>
                <option value="Happy">😊 Happy</option>
                <option value="Calm">😌 Calm</option>
                <option value="Energetic">😃 Energetic</option>
                <option value="Upset">😔 Upset</option>
                <option value="Anxious">😰 Anxious</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="health">Health Status</label>
              <input
                id="health"
                type="text"
                placeholder="e.g., Good, Fever, Headache"
                value={newUpdate.health}
                onChange={(e) => handleInputChange("health", e.target.value)}
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="learningProgress">Learning Progress</label>
              <textarea
                id="learningProgress"
                placeholder="Describe student's learning progress, achievements, or areas needing attention..."
                value={newUpdate.learningProgress}
                onChange={(e) =>
                  handleInputChange("learningProgress", e.target.value)
                }
                rows="4"
              ></textarea>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={resetForm}
              >
                Clear Form
              </button>
              <button
                type="button"
                className="btn-submit"
                onClick={handleAddUpdate}
              >
                Save Update
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Updates List Section */}
      <section className="updates-list-section">
        <h2 className="section-title">
          Recent Updates
          <span className="update-count">({updates.length})</span>
        </h2>

        {updates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p className="empty-message">No updates available yet.</p>
            {isStaff && (
              <p className="empty-hint">
                Click "Add New Update" to create your first update.
              </p>
            )}
          </div>
        ) : (
          <div className="updates-grid">
            {updates.map((update) => (
              <article className="update-card" key={update.id}>
                <div className="card-header">
                  <h3 className="student-name">{update.studentName}</h3>
                  {isStaff && (
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(update.id)}
                      aria-label="Delete update"
                      title="Delete this update"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span className="info-label">Attendance:</span>
                    <span className={`info-value badge-${update.attendance.toLowerCase()}`}>
                      {update.attendance}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Behavior:</span>
                    <span className="info-value">{update.behavior}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Mood:</span>
                    <span className="info-value">{update.mood}</span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Health:</span>
                    <span className="info-value">{update.health}</span>
                  </div>

                  <div className="info-row info-row-full">
                    <span className="info-label">Learning Progress:</span>
                    <p className="info-description">{update.learningProgress}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Updates;