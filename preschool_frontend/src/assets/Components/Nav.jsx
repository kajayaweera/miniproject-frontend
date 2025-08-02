import { Link } from 'react-router-dom';


function Nav() {
  return (
    <nav className="header">
      <div className="left_nav">
        <label>preschool</label>
      </div>
      <div className="right_nav">
        <ul className="navbar-container">
          <li><Link to="/">Home</Link></li>
          <li className="has-dropdown">
            <Link to="/regstudent">Register</Link>
            <div className="dropdown">
               <Link to="/regstudent" state={{ role: 'admin' }}>Admin</Link>
              <Link to="/regstudent" state={{ role: 'staff' }}>Staff</Link>
              <Link to="/regstudent" state={{ role: 'parent' }}>Parent</Link>
            </div>
          </li>
           <li><Link to="/login">Login</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          
          
        </ul>
      </div>
    </nav>
  );
}

export default Nav;