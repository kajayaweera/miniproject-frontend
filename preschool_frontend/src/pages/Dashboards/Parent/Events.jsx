import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../css/Events.css";

function Events() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", description: "" });

  const isStaff = location.pathname.includes("/staff/dashboard");

  useEffect(() => {
    // Simulated fetch from backend (you can replace with API)
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return alert("Please fill in all fields!");
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    setNewEvent({ title: "", date: "", description: "" });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const updateEvent = (id) => {
    const updatedTitle = prompt("Enter new event title:");
    const updatedDesc = prompt("Enter new event description:");
    if (updatedTitle) {
      setEvents(
        events.map((event) =>
          event.id === id
            ? { ...event, title: updatedTitle, description: updatedDesc || event.description }
            : event
        )
      );
    }
  };

  return (
    <div className="events-container">
      <h1 className="events-title">🎉 Preschool Events</h1>

      {isStaff && (
        <div className="add-event-form">
          <h2>Add New Event</h2>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={newEvent.title}
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleChange}
          />
          <button onClick={addEvent} className="add-btn">
            Add Event
          </button>
        </div>
      )}

      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">No events available</p>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>

              {isStaff && (
                <div className="event-actions">
                  <button onClick={() => updateEvent(event.id)} className="edit-btn">Edit</button>
                  <button onClick={() => deleteEvent(event.id)} className="delete-btn">Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Events;
