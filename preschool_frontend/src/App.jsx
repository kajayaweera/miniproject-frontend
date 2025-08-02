
import './css/App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Regstudent from './pages/Regstudent';
import Parentdashboard from './pages/Parentdashboard';
import Staffdashboard from './pages/Staffdashboard';
import Admindashboard from './pages/Admindashboard';
import Nav from "./assets/Components/Nav";




function App() {
  return (
    <Router>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/regstudent' element={<Regstudent />} />
        <Route path='/parent/dashboard' element={<Parentdashboard/>}/>
        <Route path='/staff/dashboard' element={<Staffdashboard/>}/>
        <Route path='/admin/dashboard' element={<Admindashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;