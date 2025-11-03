import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../Context/AppProvider";
import axios from "axios";
import "./ChildProfile.css";

export default function ChildProfile() {
  const { user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    age: "",
    profile_pic: null,
  });

  const [submitting, setSubmitting] = useState(false);

  // set user_id after user loads
  useEffect(() => {
    if (user && user.id) setFormData((p) => ({ ...p, user_id: user.id }));
  }, [user]);

  // show loading if user not ready
  if (!user || !user.id) {
    return <div className="create-loading">Loading user…</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, profile_pic: e.target.files[0] || null }));
  };

  // helper to inspect FormData in console
  const logFormData = (fd) => {
    // iterate and log entries for debugging
    for (let pair of fd.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_id) {
      alert("User ID missing — refresh and try again.");
      return;
    }
    if (!formData.name) {
      alert("Name is required.");
      return;
    }
    if (!formData.age) {
      alert("Age is required.");
      return;
    }
    if (!formData.profile_pic) {
      alert("Profile picture is required.");
      return;
    }

    const data = new FormData();
    data.append("user_id", formData.user_id);
    data.append("name", formData.name);
    data.append("age", formData.age);
    if (formData.profile_pic) data.append("profile_pic", formData.profile_pic);

    // debug: check what's in FormData before send
    logFormData(data);

    try {
      setSubmitting(true);
      const res = await fetch("/api/child-profiles", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert("Profile saved!");
        console.log("response:", result);
      } else {
        const errors = result.errors;
        if (errors) {
          const msg = Object.entries(errors)
            .map(([k, v]) => `${k}: ${v.join(", ")}`)
            .join("\n");
          alert(msg);
        } else {
          alert(result.message || "Failed to save profile.");
        }
      }
    } catch (err) {
      console.error("submit error:", err);
      alert("An error occurred while saving the profile.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-child-profile-wrapper">
      <div className="create-child-profile-card">
        <h2 className="create-child-title">Create Child Profile</h2>

        <form className="create-child-form" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* hidden user_id so it is present in DOM if needed */}
          <input type="hidden" name="user_id" value={formData.user_id} />

          <label className="create-label">Name</label>
          <input
            className="create-input"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label className="create-label">Age</label>
          <input
            className="create-input"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            required
          />

          <label className="create-label">Profile Picture</label>
          <input
            className="create-file-input"
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <button className="create-submit-btn" type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
