import axios from "axios";
import { useState, useEffect } from "react";
import "./UpdateChildrend.css";

export default function UpdateChildrend() {
  const [childProfiles, setChildProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingChild, setEditingChild] = useState(null);
  const [formData, setFormData] = useState({
    mood: "",
    behavioural_overview: "",
    learning_progress: "",
  });

  useEffect(() => {
    getChildren();
  }, []);

  async function getChildren() {
    try {
      setLoading(true);
      const res = await axios.get("/api/child-profiles");
      setChildProfiles(res.data);
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(child) {
    setEditingChild(child.id);
    setFormData({
      mood: child.mood,
      behavioural_overview: child.behavioural_overview,
      learning_progress: child.learning_progress,
    });
  }

  function handleCancel() {
    setEditingChild(null);
    setFormData({
      mood: "",
      behavioural_overview: "",
      learning_progress: "",
    });
  }

  async function handleUpdate(childId) {
    try {
      await axios.put(`/api/child-profiles/${childId}`, formData);
      await getChildren();
      handleCancel();
      alert("Child profile updated successfully!");
    } catch (error) {
      console.error("Error updating child:", error);
      alert("Failed to update child profile");
    }
  }

  async function handleDelete(childId) {
    if (window.confirm("Are you sure you want to delete this child profile?")) {
      try {
        await axios.delete(`/api/child-profiles/${childId}`);
        await getChildren();
        alert("Child profile deleted successfully!");
      } catch (error) {
        console.error("Error deleting child:", error);
        alert("Failed to delete child profile");
      }
    }
  }

  function handleInputChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  if (loading) {
    return (
      <div className="update-children-loading-container">
        <div className="update-children-spinner"></div>
        <p>Loading children profiles...</p>
      </div>
    );
  }

  return (
    <div className="update-children-container">
      <h1 className="update-children-page-title">Manage Child Profiles</h1>

      <div className="update-children-grid">
        {childProfiles.map((child) => (
          <div key={child.id} className="update-children-child-card">
            <div className="update-children-card-header">
              <img
                src={child.profile_pic || "/default-avatar.png"}
                alt={child.name}
                className="update-children-profile-pic"
              />
              <div className="update-children-child-info">
                <h2>{child.name}</h2>
                <p className="update-children-age">Age: {child.age}</p>
              </div>
            </div>

            {editingChild === child.id ? (
              <div className="update-children-edit-form">
                <div className="update-children-form-group">
                  <label>Mood</label>
                  <select
                    name="mood"
                    value={formData.mood}
                    onChange={handleInputChange}
                    className="update-children-input-field"
                  >
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😢 Sad</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="calm">😌 Calm</option>
                    <option value="angry">😠 Angry</option>
                    <option value="tired">😴 Tired</option>
                  </select>
                </div>

                <div className="update-children-form-group">
                  <label>Behavioural Overview</label>
                  <textarea
                    name="behavioural_overview"
                    value={formData.behavioural_overview}
                    onChange={handleInputChange}
                    className="update-children-input-field update-children-textarea"
                    rows="3"
                    placeholder="Enter behavioural notes..."
                  />
                </div>

                <div className="update-children-form-group">
                  <label>Learning Progress</label>
                  <textarea
                    name="learning_progress"
                    value={formData.learning_progress}
                    onChange={handleInputChange}
                    className="update-children-input-field update-children-textarea"
                    rows="3"
                    placeholder="Enter learning progress..."
                  />
                </div>

                <div className="update-children-button-group">
                  <button
                    onClick={() => handleUpdate(child.id)}
                    className="update-children-btn update-children-btn-save"
                  >
                    💾 Save Changes
                  </button>
                  <button onClick={handleCancel} className="update-children-btn update-children-btn-cancel">
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="update-children-view-mode">
                <div className="update-children-info-section">
                  <span className="update-children-label">Mood:</span>
                  <span className="update-children-value update-children-mood-badge">{child.mood}</span>
                </div>

                <div className="update-children-info-section">
                  <span className="update-children-label">Behavioural Overview:</span>
                  <p className="update-children-value">{child.behavioural_overview}</p>
                </div>

                <div className="update-children-info-section">
                  <span className="update-children-label">Learning Progress:</span>
                  <p className="update-children-value">{child.learning_progress}</p>
                </div>

                <div className="update-children-button-group">
                  <button
                    onClick={() => handleEdit(child)}
                    className="update-children-btn update-children-btn-edit"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="update-children-btn update-children-btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {childProfiles.length === 0 && (
        <div className="update-children-no-data">
          <p>No child profiles found</p>
        </div>
      )}
    </div>
  );
}