



import { useState, useEffect } from 'react';
import '../css/About.css';
import hasara from '../assets/imagessir4.jpg';
import bob from '../assets/imagessir2.jpg';
import roshi from '../assets/downloadt1.jpg';
import kushi from '../assets/imagesteacher.jpg';
import madura from '../assets/imagessir1.jpg';
import chathura from '../assets/imagessir3.jpg';
import perera from '../assets/downloadtea2.jpg';
import kanthi from '../assets/download.jpg';

function About() {
  const [isVisible, setIsVisible] = useState({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Staff data for better organization
  const staffMembers = [
    {
      id: 1,
      name: 'Mr. Hasara Wijesinghe',
      position: 'Principal',
      image: hasara,
      description: 'Leading our school with 15+ years of educational experience',
      qualifications: 'M.Ed in Educational Leadership'
    },
    {
      id: 2,
      name: 'Mr. Bob Fernando',
      position: 'Vice Principal',
      image: bob,
      description: 'Supporting academic excellence and student development',
      qualifications: 'B.Ed in Early Childhood Education'
    },
    {
      id: 3,
      name: 'Ms. Roshi Perera',
      position: 'Senior Teacher',
      image: roshi,
      description: 'Specialized in creative learning and child psychology',
      qualifications: 'Diploma in Child Psychology'
    },
    {
      id: 4,
      name: 'Ms. Kushi Silva',
      position: 'Lead Teacher',
      image: kushi,
      description: 'Expert in early childhood development and play-based learning',
      qualifications: 'Certificate in Montessori Method'
    },
    {
      id: 5,
      name: 'Mr. Madura Rajapaksa',
      position: 'Teacher',
      image: madura,
      description: 'Focus on physical education and outdoor activities',
      qualifications: 'B.Sc in Physical Education'
    },
    {
      id: 6,
      name: 'Mr. Chathura Mendis',
      position: 'Teacher',
      image: chathura,
      description: 'Mathematics and logical thinking development specialist',
      qualifications: 'B.Sc in Mathematics'
    },
    {
      id: 7,
      name: 'Ms.  Thamara Perera',
      position: 'Teacher',
      image: perera,
      description: 'Arts, crafts and creative expression instructor',
      qualifications: 'Diploma in Fine Arts'
    },
    {
      id: 8,
      name: 'Ms. Kanthi Dissanayake',
      position: 'Teacher',
      image: kanthi,
      description: 'Language development and communication skills expert',
      qualifications: 'B.A in English Literature'
    }
  ];

  // Mission and Vision data
  const aboutData = {
    mission: {
      title: 'Our Mission',
      content: 'To provide a digital platform that simplifies preschool management, tracks child development, and keeps parents actively informed through real-time updates and smart tools.',
      icon: '🎯'
    },
    vision: {
      title: 'Our Vision',
      content: 'To create a smart, connected, and caring preschool environment that supports every child\'s growth and strengthens the parent-teacher relationship.',
      icon: '🔮'
    },
    values: {
      title: 'Our Values',
      content: 'We believe in nurturing creativity, fostering curiosity, ensuring safety, and building strong partnerships with families to create the best learning environment for every child.',
      icon: '💝'
    }
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About Sigithi Pre School</h1>
            <p className="hero-subtitle">
              Dedicated to nurturing young minds through innovative education, 
              caring guidance, and strong community partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            {Object.entries(aboutData).map(([key, data], index) => (
              <div 
                key={key}
                id={`${key}-card`}
                data-animate
                className={`mission-card ${isVisible[`${key}-card`] ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="mission-icon">{data.icon}</div>
                <h2 className="mission-title">{data.title}</h2>
                <p className="mission-content">{data.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label-2">Years of Experience</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label-2">Happy Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label-2">Expert Teachers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label-2">Parent Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="staff-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Dedicated Team</h2>
            <p className="section-subtitle">
              Our experienced and caring staff members are committed to providing 
              the best educational experience for your child.
            </p>
          </div>

          <div className="staff-grid">
            {staffMembers.map((member, index) => (
              <div 
                key={member.id}
                id={`staff-${member.id}`}
                data-animate
                className={`staff-card ${isVisible[`staff-${member.id}`] ? 'animate-in' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="staff-image-wrapper">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="staff-image"
                    loading="lazy"
                  />
                  <div className="staff-overlay">
                    <div className="staff-overlay-content">
                      <p className="staff-qualifications">{member.qualifications}</p>
                    </div>
                  </div>
                </div>
                
                <div className="staff-content">
                  <h3 className="staff-name">{member.name}</h3>
                  <div className="staff-position">{member.position}</div>
                  <p className="staff-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Join Our Family?</h2>
            <p className="cta-description">
              Give your child the best start in their educational journey. 
              Contact us today to learn more about enrollment.
            </p>
            <div className="cta-buttons-2">
              <a href="/contact" className="cta-btn-2 primary">
                <span className="btn-icon-2">📞</span>
                Contact Us
              </a>
              <a href="/register" className="cta-btn-2 secondary">
                <span className="btn-icon-2">📝</span>
                Enroll Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;