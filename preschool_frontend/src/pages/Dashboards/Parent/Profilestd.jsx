import "../../../css/Profilestd.css";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../../Context/AppProvider";

function ChildProfile() {
  const {user, token} = useContext(AppContext);
  const [childprofile, setChildProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getChild(){
    try {
      const res = await axios.get(`/api/child/profile/${user.id}`);
      setChildProfile(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching child profile:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getChild();
  },[]);

  if (loading) {
    return <div className="loading-container"><div className="loader"></div></div>;
  }

  if (!childprofile) {
    return <div className="no-data">No profile data available</div>;
  }

  return(
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-pic-wrapper">
            <img 
              src={childprofile.profile_pic || '/default-avatar.png'} 
              alt={childprofile.name}
              className="profile-pic"
            />
            <div className="mood-badge">{childprofile.mood || 'happy'}</div>
          </div>
          <h1 className="profile-name">{childprofile.name}</h1>
          <p className="profile-age">{childprofile.age} years old</p>
          
          {/* Attendance Status */}
          <div className="attendance-indicator">
            <span className={`attendance-badge ${childprofile.attendance ? 'present' : 'absent'}`}>
              {childprofile.attendance ? '✓ Present Today' : '✗ Absent Today'}
            </span>
          </div>
        </div>

        <div className="profile-content">
          <div className="info-card">
            <div className="card-icon">📚</div>
            <h3>Learning Progress</h3>
            <p>{childprofile['learning progress'] || childprofile.learning_progress || 'On track'}</p>
          </div>

          <div className="info-card">
            <div className="card-icon">⭐</div>
            <h3>Behavioral Overview</h3>
            <p>{childprofile['behavioural overview'] || childprofile.behavioural_overview || 'No issues reported'}</p>
          </div>

          <div className="info-card">
            <div className="card-icon">😊</div>
            <h3>Current Mood</h3>
            <p className="mood-text">{childprofile.mood || 'happy'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildProfile;
