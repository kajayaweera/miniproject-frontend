import '../css/Home.css';
import { Link } from 'react-router-dom';
import homeicon from '../assets/preschool.jpg';
import location from  '../assets/location.png';
import mail from  '../assets/email.jpg';
import cll from  '../assets/telephone.png';


function Home() {
  return (
    <div>
      <div className="home-container" style={{ backgroundImage: `url(${homeicon})` }}>
        

        <div className="welcome-section">
          <p className='wlcm'>Welcome to Sigithi Pre School</p>
          <p className='purpose'>Let's raise a quality student in a fun and safe way</p>
          <Link to='/cources' className='cource-btn'>Add External Courses</Link>
        </div>
      </div>
      <div>
            <h2 className='contct-topic'>Contact us</h2>
            <div className='cntct'>
               <div className='con-item'>
                <img src={location} className='icon'/><br/>
                <label>Visit us</label><br/>
                <label>567/A, Colombo Road, Eheliyagoda</label>
               </div>
               <div className='con-item'>
                <img src={cll} className='icon' /><br/>
                <label>Let's talk</label><br/>
                <label>011 2345678</label>
               </div>
               <div className='con-item'>
                <img src={mail} className='icon' /><br/>
                <label>Email us</label><br/>
                <label>Sigithi@gmail.com</label>
               </div>
            </div>
        </div>

    </div>  
    
    
  );
}

export default Home;