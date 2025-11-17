import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../css/Events.css";

function Events() {
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    description: "",
    image: "",
  });

  const isStaff = location.pathname.includes("/staff/dashboard");
  const isAdmin = location.pathname.includes("/admin/dashboard");
  const isParent = location.pathname.includes("/parent/dashboard");

  // ✅ Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
  }, []);

  // ✅ Save events to localStorage whenever events update
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // ✅ Handle image upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Add new event
  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.description || !newEvent.image) {
      alert("Please fill all fields and upload an image!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: newEvent.title,
      date: newEvent.date,
      description: newEvent.description,
      image: newEvent.image,
    };

    setEvents([...events, newEntry]);
    setNewEvent({ title: "", date: "", description: "", image: "" });
  };

  // ✅ Delete event
  const deleteEvent = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  // ✅ Update event
  const updateEvent = (id) => {
    const selectedEvent = events.find((event) => event.id === id);
    const updatedTitle = prompt("Enter new event title:", selectedEvent.title);
    const updatedDesc = prompt("Enter new event description:", selectedEvent.description);

    // Optional image update
    const changeImage = window.confirm("Do you want to change the event image?");
    if (changeImage) {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          const updatedImage = reader.result;
          setEvents(
            events.map((event) =>
              event.id === id
                ? { ...event, title: updatedTitle || event.title, description: updatedDesc || event.description, image: updatedImage }
                : event
            )
          );
        };
        reader.readAsDataURL(file);
      };
      fileInput.click();
    } else {
      setEvents(
        events.map((event) =>
          event.id === id
            ? { ...event, title: updatedTitle || event.title, description: updatedDesc || event.description }
            : event
        )
      );
    }
  };

  return (
    <div className="events-container">
      <h1 className="events-title">🎉 Preschool Events</h1>

      {/* ✅ Add event section (for Admin & Staff only) */}
      {(isAdmin || isStaff) && (
        <div className="add-event-form">
          <h2>Add New Event</h2>

          <input
            type="text"
            name="title"
            placeholder="Enter event title"
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
            placeholder="Enter event description"
            value={newEvent.description}
            onChange={handleChange}
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {newEvent.image && (
            <img
              src={newEvent.image}
              alt="Event Preview"
              className="preview-img"
            />
          )}

          <button onClick={addEvent} className="add-btn">
            Add Event
          </button>
        </div>
      )}

      {/* ✅ Display all events */}
      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">No events available yet</p>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event.id}>
              {event.image && (
                <img src={event.image} alt="Event" className="event-img" />
              )}
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {event.date}</p>
              <p>{event.description}</p>

              {(isAdmin || isStaff) && (
                <div className="event-actions">
                  <button onClick={() => updateEvent(event.id)} className="edit-btn">
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="delete-btn">
                    🗑️ Delete
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

export default Events;
