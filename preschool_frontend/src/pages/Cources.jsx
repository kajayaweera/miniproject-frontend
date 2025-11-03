import { useState } from 'react';
import '../css/Cources.css';
import { Link } from 'react-router-dom';
import { useCart } from '../Context/CartContext'; // ✅ import context
import swimming from '../assets/swimming.jpg';
import karate from '../assets/karate.jpg';
import chess from '../assets/chess.jpg';
import cricket from '../assets/cricket.jpg';
import instrument from '../assets/music.jpg';
import dancing from '../assets/dance.jpg';
import art from '../assets/pencil_art.jpg';
import gymnastic from '../assets/gymnastic.jpg';
import yoga from '../assets/yoga.jpg';
import sport from '../assets/mini_athletics.jpg';


function Cources() {
  const { cart, addToCart, removeFromCart } = useCart(); // ✅ use context
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const courses = [
    { id: 1, name: 'Swimming', image: swimming, price: 1000, description: 'Learn swimming techniques and water safety', duration: '1 hour per session' },
    { id: 2, name: 'Karate', image: karate, price: 1000, description: 'Basic martial arts and self-discipline training', duration: '45 minutes per session' },
    { id: 3, name: 'Chess', image: chess, price: 1000, description: 'Strategic thinking and problem-solving skills', duration: '1 hour per session' },
    { id: 4, name: 'Cricket', image: cricket, price: 1000, description: 'Team sports and hand-eye coordination', duration: '1 hour per session' },
    { id: 5, name: 'Musical Instruments', image: instrument, price: 1000, description: 'Introduction to various musical instruments', duration: '45 minutes per session' },
    { id: 6, name: 'Dancing', image: dancing, price: 1000, description: 'Creative movement and rhythm development', duration: '45 minutes per session' },
    { id: 7, name: 'Pencil Art', image: art, price: 1000, description: 'Drawing and creative expression techniques', duration: '1 hour per session' },
    { id: 8, name: 'Gymnastics', image: gymnastic, price: 1000, description: 'Physical fitness and flexibility training', duration: '1 hour per session' },
    { id: 9, name: 'Yoga', image: yoga, price: 1000, description: 'Mindfulness and body awareness for kids', duration: '30 minutes per session' },
    { id: 10, name: 'Mini Athletics', image: sport, price: 1000, description: 'Basic athletic skills and sportsmanship', duration: '1 hour per session' },
  ];

  const isInCart = (courseId) => cart.some((item) => item.id === courseId);

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAddToCart = (course) => {
    addToCart(course);
    showNotificationMessage(`${course.name} added to cart!`);
  };

  const handleRemoveFromCart = (id, name) => {
    removeFromCart(id);
    showNotificationMessage(`${name} removed from cart!`);
  };

  const getTotalPrice = () => cart.reduce((t, i) => t + i.price, 0);

  return (
    <div className="courses-page">
      {showNotification && <div className="notification">✓ {notificationMessage}</div>}

      <section className="courses-header">
        <h1>External Courses</h1>
        <p>Enhance your child's skills with our extracurricular activities</p>
        {cart.length > 0 && (
          <div className="cart-summary">
            <span>🛒 {cart.length} selected | Total: Rs.{getTotalPrice()}</span>
            <Link to="/login" className="view-cart-btn">Login & View Bill</Link>
          </div>
        )}
      </section>

      <section className="courses-section">
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <img src={course.image} alt={course.name} className="course-image" />
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Price:</strong> Rs.{course.price}</p>

              {isInCart(course.id) ? (
                <button className="remove-btn" onClick={() => handleRemoveFromCart(course.id, course.name)}>Remove</button>
              ) : (
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(course)}>Add to Cart</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Cources;
