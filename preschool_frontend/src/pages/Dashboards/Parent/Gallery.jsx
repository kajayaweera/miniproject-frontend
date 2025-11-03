import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../css/Gallery.css";

const Gallery = () => {
  const location = useLocation();
  const isStaff = location.pathname.includes("/staff/dashboard");

  const [images, setImages] = useState([]);

  // Load gallery from localStorage (shared between parent and staff)
  useEffect(() => {
    const storedImages = localStorage.getItem("galleryImages");
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    } else {
      const initialImages = [
        { id: 1, src: "https://placekitten.com/250/250", title: "Art Day" },
        { id: 2, src: "https://placebear.com/250/250", title: "Playtime" },
        { id: 3, src: "https://place-puppy.com/250x250", title: "Music Class" },
      ];
      setImages(initialImages);
      localStorage.setItem("galleryImages", JSON.stringify(initialImages));
    }
  }, []);

  // Save updates to localStorage
  const saveToLocalStorage = (newImages) => {
    setImages(newImages);
    localStorage.setItem("galleryImages", JSON.stringify(newImages));
  };

  const [newImage, setNewImage] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const handleAddImage = () => {
    if (newImage && newTitle) {
      const newEntry = {
        id: Date.now(),
        src: newImage,
        title: newTitle,
      };
      const updatedImages = [...images, newEntry];
      saveToLocalStorage(updatedImages);
      setNewImage("");
      setNewTitle("");
    }
  };

  const handleDelete = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    saveToLocalStorage(updatedImages);
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">
        {isStaff ? "Staff Gallery Management" : "Preschool Gallery"}
      </h2>

      {isStaff && (
        <div className="upload-section">
          <input
            type="text"
            placeholder="Image URL"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleAddImage}>Add Image</button>
        </div>
      )}

      <div className="gallery-grid">
        {images.map((image) => (
          <div className="gallery-item" key={image.id}>
            <img src={image.src} alt={image.title} />
            <p>{image.title}</p>
            {isStaff && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(image.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
