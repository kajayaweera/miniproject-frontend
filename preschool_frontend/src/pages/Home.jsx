import '../css/Home.css';


import homeicon from '../assets/preschool.jpg';


function Home() {
  return (
    <>
      <div className="home-container" style={{ backgroundImage: `url(${homeicon})` }}>
        

        <div className="welcome-section">
          <p className='wlcm'>Welcome to Sigithi Pre School</p>
          <p className='purpose'>Let's raise a quality student in a fun and safe way</p>
          <button className='cource-btn'>Add External Courses</button>
        </div>
      </div>
    </>
  );
}

export default Home;