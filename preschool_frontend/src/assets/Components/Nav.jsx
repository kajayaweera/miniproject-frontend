import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppProvider';
import '../../css/Nav.css';


function Nav() {
  const { token, setToken, user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/logout', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        navigate('/');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link" onClick={closeMenu}>
            <span className="brand-icon">🎓</span>
            <span className="brand-text">Preschool</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/about" className="nav-link" onClick={closeMenu}>
                About Us
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/contact" className="nav-link" onClick={closeMenu}>
                Contact Us
              </Link>
            </li>
            

            {/* Authentication Links */}
            {user ? (
              <li className="nav-item auth-item">
                <div className="user-menu">

                  {user.role === 'parent' && (
                    <Link to="parent/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  )}

                  {user.role === 'teacher' && (
                    <Link to="staff/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link to="admin/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  )}
                  
                  <span className="user-greeting">
                    Welcome, {user.name || 'User'}
                  </span>
                  <form onSubmit={handleLogout} className="logout-form">
                    <button 
                      type="submit" 
                      className="nav-link logout-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging out...' : 'Logout'}
                    </button>
                  </form>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item auth-item">
                  <Link to="/login" className="nav-link login-link" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item auth-item">
                  <Link to="/register" className="nav-link register-link" onClick={closeMenu}>
                    Register
                  </Link>
                </li>
              </>
            )}

            
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;