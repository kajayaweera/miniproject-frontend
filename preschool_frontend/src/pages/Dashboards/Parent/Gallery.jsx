import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../css/Gallery.css";

const Gallery = () => {
  const location = useLocation();
  const isStaff = location.pathname.includes("/staff/dashboard");
  const isAdmin = location.pathname.includes("/admin/dashboard");
  const isParent = location.pathname.includes("/parent/dashboard");

  const [images, setImages] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newFile, setNewFile] = useState(null);

  // Load gallery from localStorage (shared between all roles)
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

  // Save images to localStorage
  const saveToLocalStorage = (newImages) => {
    setImages(newImages);
    localStorage.setItem("galleryImages", JSON.stringify(newImages));
  };

  // Handle adding new image
  const handleAddImage = () => {
    if (!newFile || !newTitle) {
      alert("Please select an image and enter a title!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newEntry = {
        id: Date.now(),
        src: reader.result,
        title: newTitle,
      };
      const updatedImages = [...images, newEntry];
      saveToLocalStorage(updatedImages);
      setNewTitle("");
      setNewFile(null);
    };
    reader.readAsDataURL(newFile);
  };

  // Handle delete
  const handleDelete = (id) => {
    const updatedImages = images.filter((img) => img.id !== id);
    saveToLocalStorage(updatedImages);
  };

  // Handle update
  const handleUpdate = (id) => {
    const imageToUpdate = images.find((img) => img.id === id);
    const updatedTitle = prompt("Enter new image title:", imageToUpdate.title);

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const updatedImages = images.map((img) =>
          img.id === id
            ? {
                ...img,
                title: updatedTitle || img.title,
                src: file ? reader.result : img.src,
              }
            : img
        );
        saveToLocalStorage(updatedImages);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        const updatedImages = images.map((img) =>
          img.id === id
            ? { ...img, title: updatedTitle || img.title }
            : img
        );
        saveToLocalStorage(updatedImages);
      }
    };

    input.click();
  };

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">
        {isParent ? "Preschool Gallery" : "Gallery Management"}
      </h2>

      {/* Upload Section - Only Staff/Admin */}
      {(isStaff || isAdmin) && (
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Image Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button onClick={handleAddImage} className="add-btn">
            Add Image
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {images.length === 0 ? (
          <p>No images available</p>
        ) : (
          images.map((image) => (
            <div className="gallery-item" key={image.id}>
              <img src={image.src} alt={image.title} />
              <p>{image.title}</p>

              {/* Only Staff/Admin can Edit/Delete */}
              {(isStaff || isAdmin) && (
                <div className="gallery-actions">
                  <button className="edit-btn" onClick={() => handleUpdate(image.id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(image.id)}>
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
};

export default Gallery;
