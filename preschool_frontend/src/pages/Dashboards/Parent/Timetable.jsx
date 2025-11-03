import React, { useState } from "react";
import "../../../css/timetable.css";

function Timetable() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const scheduleData = {
    Monday: [
      { time: "8:30 - 9:00 AM", subject: "Morning Circle", icon: "🌞", description: "Welcome activities and daily planning", type: "circle-time" },
      { time: "9:00 - 10:00 AM", subject: "Learning Time", icon: "📖", description: "Alphabet, numbers, and basic concepts", type: "learning" },
      { time: "10:00 - 10:30 AM", subject: "Snack Break", icon: "🍎", description: "Healthy snacks and social interaction", type: "break" },
      { time: "10:30 - 11:30 AM", subject: "Creative Activities", icon: "🎨", description: "Art, craft, and creative expression", type: "creative" },
      { time: "11:30 - 12:00 PM", subject: "Outdoor Play", icon: "⚽", description: "Physical activities and fresh air", type: "outdoor" },
      { time: "12:00 - 12:30 PM", subject: "Story Time", icon: "📚", description: "Reading and storytelling session", type: "story" },
      { time: "12:30 PM", subject: "Home Time", icon: "🏡", description: "Pack up and prepare to go home", type: "home" },
    ],
    Tuesday: [
      { time: "8:30 - 9:00 AM", subject: "Morning Circle", icon: "🌞", description: "Welcome activities and daily planning", type: "circle-time" },
      { time: "9:00 - 10:00 AM", subject: "Math Fun", icon: "🔢", description: "Numbers, counting, and basic math", type: "learning" },
      { time: "10:00 - 10:30 AM", subject: "Snack Break", icon: "🍌", description: "Nutritious snacks and hydration", type: "break" },
      { time: "10:30 - 11:30 AM", subject: "Music & Dance", icon: "🎵", description: "Songs, rhythm, and movement", type: "creative" },
      { time: "11:30 - 12:00 PM", subject: "Garden Time", icon: "🌱", description: "Nature exploration and gardening", type: "outdoor" },
      { time: "12:00 - 12:30 PM", subject: "Quiet Time", icon: "😴", description: "Rest and relaxation period", type: "story" },
      { time: "12:30 PM", subject: "Home Time", icon: "🏡", description: "Pack up and prepare to go home", type: "home" },
    ],
    Wednesday: [
      { time: "8:30 - 9:00 AM", subject: "Morning Circle", icon: "🌞", description: "Welcome activities and daily planning", type: "circle-time" },
      { time: "9:00 - 10:00 AM", subject: "Science Discovery", icon: "🔬", description: "Simple experiments and exploration", type: "learning" },
      { time: "10:00 - 10:30 AM", subject: "Snack Break", icon: "🥕", description: "Healthy vegetables and fruits", type: "break" },
      { time: "10:30 - 11:30 AM", subject: "Building & Construction", icon: "🧱", description: "Blocks, puzzles, and building activities", type: "creative" },
      { time: "11:30 - 12:00 PM", subject: "Sports & Games", icon: "🏃", description: "Team games and physical challenges", type: "outdoor" },
      { time: "12:00 - 12:30 PM", subject: "Show & Tell", icon: "🎤", description: "Children share their experiences", type: "story" },
      { time: "12:30 PM", subject: "Home Time", icon: "🏡", description: "Pack up and prepare to go home", type: "home" },
    ],
    Thursday: [
      { time: "8:30 - 9:00 AM", subject: "Morning Circle", icon: "🌞", description: "Welcome activities and daily planning", type: "circle-time" },
      { time: "9:00 - 10:00 AM", subject: "Language Arts", icon: "✏️", description: "Writing practice and phonics", type: "learning" },
      { time: "10:00 - 10:30 AM", subject: "Snack Break", icon: "🧀", description: "Protein-rich snacks and milk", type: "break" },
      { time: "10:30 - 11:30 AM", subject: "Drama & Theater", icon: "🎭", description: "Role play and dramatic activities", type: "creative" },
      { time: "11:30 - 12:00 PM", subject: "Nature Walk", icon: "🦋", description: "Exploring the outdoor environment", type: "outdoor" },
      { time: "12:00 - 12:30 PM", subject: "Reading Corner", icon: "📖", description: "Independent and guided reading", type: "story" },
      { time: "12:30 PM", subject: "Home Time", icon: "🏡", description: "Pack up and prepare to go home", type: "home" },
    ],
    Friday: [
      { time: "8:30 - 9:00 AM", subject: "Morning Circle", icon: "🌞", description: "Welcome activities and daily planning", type: "circle-time" },
      { time: "9:00 - 10:00 AM", subject: "Fun Friday Activities", icon: "🎉", description: "Special themed activities and games", type: "learning" },
      { time: "10:00 - 10:30 AM", subject: "Party Snack", icon: "🍰", description: "Special treats and celebration", type: "break" },
      { time: "10:30 - 11:30 AM", subject: "Free Choice Time", icon: "🎲", description: "Children choose their favorite activities", type: "creative" },
      { time: "11:30 - 12:00 PM", subject: "Group Games", icon: "🤝", description: "Team building and cooperative games", type: "outdoor" },
      { time: "12:00 - 12:30 PM", subject: "Week Review", icon: "⭐", description: "Reflecting on the week's learning", type: "story" },
      { time: "12:30 PM", subject: "Home Time", icon: "🏡", description: "Pack up and prepare to go home", type: "home" },
    ]
  };

  const currentSchedule = scheduleData[selectedDay] || scheduleData.Monday;

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const timeSlots = [
      { start: 8 * 60 + 30, end: 9 * 60, index: 0 },
      { start: 9 * 60, end: 10 * 60, index: 1 },
      { start: 10 * 60, end: 10 * 60 + 30, index: 2 },
      { start: 10 * 60 + 30, end: 11 * 60 + 30, index: 3 },
      { start: 11 * 60 + 30, end: 12 * 60, index: 4 },
      { start: 12 * 60, end: 12 * 60 + 30, index: 5 },
      { start: 12 * 60 + 30, end: 24 * 60, index: 6 },
    ];

    const currentSlot = timeSlots.find(slot => currentTime >= slot.start && currentTime < slot.end);
    return currentSlot ? currentSlot.index : -1;
  };

  const currentTimeSlot = getCurrentTimeSlot();

  return (
    <div className="timetable-container">
      {/* Header Section */}
      <div className="timetable-header">
        <div className="header-content">
          <h2 className="timetable-title">📅 Weekly Timetable</h2>
          <p className="timetable-subtitle">Your child's daily schedule and activities</p>
        </div>
        <div className="current-time-info">
          <div className="current-day">
            Today: <span className="highlight-day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
          </div>
          <div className="current-time">
            {new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="day-selector">
        <h3 className="selector-title">Select Day:</h3>
        <div className="day-buttons">
          {weekDays.map((day) => (
            <button
              key={day}
              className={`day-btn ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Header */}
      <div className="selected-day-header">
        <h3 className="selected-day-title">{selectedDay}'s Schedule</h3>
        <div className="day-summary">
          {currentSchedule.length} activities planned for the day
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="timetable-grid">
        {currentSchedule.map((item, index) => (
          <div 
            key={index} 
            className={`timetable-card ${item.type} ${
              currentTimeSlot === index && selectedDay === new Date().toLocaleDateString('en-US', { weekday: 'long' }) 
                ? 'current-activity' 
                : ''
            }`}
          >
            <div className="card-header">
              <div className="activity-icon">{item.icon}</div>
              <div className="time-badge">{item.time}</div>
            </div>
            
            <div className="card-body">
              <h4 className="subject-title">{item.subject}</h4>
              <p className="activity-description">{item.description}</p>
            </div>

            <div className="card-footer">
              <div className="activity-type-badge">{item.type.replace('-', ' ')}</div>
              {currentTimeSlot === index && selectedDay === new Date().toLocaleDateString('en-US', { weekday: 'long' }) && (
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  Live Now
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info Section */}
      <div className="additional-info">
        <div className="info-card">
          <h4>📋 Daily Reminders</h4>
          <ul>
            <li>🎒 Please send a water bottle daily</li>
            <li>🥪 Healthy snacks are encouraged</li>
            <li>👕 Comfortable clothes for outdoor activities</li>
            <li>📚 Library books should be returned on Fridays</li>
          </ul>
        </div>
        
        
      </div>
    </div>
  );
}

export default Timetable;