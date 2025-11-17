import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../Context/AppProvider";
import "./ChildProfile.css";

export default function ChildProfile() {
  const { user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    user_id: "",
    firstName: "",
    lastName: "",
    age: "",
    profile_pic: null,
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Set user_id when user loads
  useEffect(() => {
    if (user && user.id) {
      setFormData((prev) => ({ ...prev, user_id: user.id }));
    }
  }, [user]);

  // Show loading state if user data isn't ready
  if (!user || !user.id) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading user information...</p>
        </div>
      </div>
    );
  }

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file upload with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ 
          ...prev, 
          profile_pic: "Please select an image file" 
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ 
          ...prev, 
          profile_pic: "Image size should be less than 5MB" 
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, profile_pic: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors((prev) => ({ ...prev, profile_pic: "" }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (formData.age < 1 || formData.age > 18) {
      newErrors.age = "Age must be between 1 and 18";
    }

    if (!formData.profile_pic) {
      newErrors.profile_pic = "Profile picture is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare FormData for API
    const data = new FormData();
    data.append("user_id", formData.user_id);
    data.append("name", `${formData.firstName} ${formData.lastName}`);
    data.append("age", formData.age);
    data.append("profile_pic", formData.profile_pic);

    try {
      setSubmitting(true);
      
      const response = await fetch("/api/child-profiles", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        // Success - reset form
        setFormData({
          user_id: user.id,
          firstName: "",
          lastName: "",
          age: "",
          profile_pic: null,
        });
        setPreviewUrl(null);
        alert("Profile created successfully! ✓");
        console.log("Profile created:", result);
      } else {
        // Handle API errors
        if (result.errors) {
          const errorMsg = Object.entries(result.errors)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join("\n");
          alert(`Validation errors:\n${errorMsg}`);
        } else {
          alert(result.message || "Failed to create profile. Please try again.");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while saving the profile. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">🧑‍🦱 Create Child Profile 👧</h1>
          
        </div>

        {/* Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First Name 
              </label>
              <input
                id="firstName"
                className={`form-input ${errors.firstName ? "input-error" : ""}`}
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last Name 
              </label>
              <input
                id="lastName"
                className={`form-input ${errors.lastName ? "input-error" : ""}`}
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Age Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="age">
              Age 
            </label>
            <input
              id="age"
              className={`form-input ${errors.age ? "input-error" : ""}`}
              name="age"
              type="number"
              placeholder="Enter age "
              min="1"
              max="6"
              value={formData.age}
              onChange={handleInputChange}
            />
            {errors.age && (
              <span className="error-message">{errors.age}</span>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div className="form-group">
            <label className="form-label" htmlFor="profile_pic">
              Profile Picture 
            </label>
            
            <div className="file-upload-wrapper">
              <input
                id="profile_pic"
                className="file-input"
                name="profile_pic"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="profile_pic" className="file-upload-label">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{formData.profile_pic ? formData.profile_pic.name : "Choose an image"}</span>
              </label>
            </div>
            
            {errors.profile_pic && (
              <span className="error-message">{errors.profile_pic}</span>
            )}

            {/* Image Preview */}
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Profile preview" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            className="submit-button" 
            type="submit" 
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="button-spinner"></span>
                Creating Profile...
              </>
            ) : (
              "Create Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}