import './css/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Cources from './pages/Cources';
import Parentdashboard from './pages/Dashboards/Parent/Parentdashboard';
import Admindashboard from './pages/Dashboards/Admin/Admindashboard';
import Staffdashboard from './pages/Dashboards/Staff/Staffdashboard';
import Nav from "./assets/Components/Nav";
import Timetable from './pages/Dashboards/Parent/Timetable';
import Bedtimestory from './pages/Dashboards/Parent/Bedtimestory';
import Billing from './pages/Dashboards/Parent/Billing';
import Profilestd from './pages/Dashboards/Parent/Profilestd';
import Digitalreport from './pages/Dashboards/Parent/Digitalreport';
import Updates from './pages/Dashboards/Parent/Updates';
import Profilestaff from './pages/Dashboards/Staff/Profilestaff';
import StaffAttendance from './pages/Dashboards/Admin/StaffAttendance';
import Notices from './pages/Dashboards/Parent/Notices';
import Events from './pages/Dashboards/Parent/Events';
import Gallery from './pages/Dashboards/Parent/Gallery';
import LiveStream from './pages/Dashboards/Parent/LiveStream';

import Feedback from './pages/Dashboards/Admin/Feedback';
import CommonNotices from './pages/Dashboards/Admin/CommonNotices';

import { CartProvider } from "./Context/CartContext";  
import ChildProfile from './pages/Dashboards/Parent/ChildProfile';
import UpdateChildrend from './pages/Dashboards/Staff/UpdateChildrend';
import Checkout from './pages/Dashboards/Parent/Checkout';
import PaymentsView from './pages/Dashboards/Admin/PaymentsView';
import SallaryUpdate from './pages/Dashboards/Admin/SallaryUpdate';
import Salary from './pages/Dashboards/Staff/Salary';
import { useContext } from 'react';
import { AppContext } from './Context/AppProvider';
import ChildrenAttendance from './pages/Dashboards/Staff/Attendance';
import ChildrenMood from './pages/Dashboards/Staff/ChildrenMood';


function App() {

  const  {user , token} = useContext(AppContext);

  

  return (
    <CartProvider>  
      <Router>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/cources' element={<Cources />} />
          <Route path='/parent/dashboard'element={user?.role === 'parent' ? <Parentdashboard /> : <Login />} />
          <Route path='/staff/dashboard' element={user?.role === 'teacher' ? <Staffdashboard /> : <Login />} />
          <Route path='/staff/salary' element={<Salary />} />
          <Route path='/admin/dashboard' element={user?.role === 'admin' ? <Admindashboard /> : <Login />} />
          <Route path='/parent/timetable' element={<Timetable />} /> 
          <Route path='/parent/bedtimestory' element={<Bedtimestory />} />
          <Route path='/parent/billing' element={<Billing />} />
          <Route path='/parent/profilestd' element={<Profilestd />} />
          <Route path='/parent/digitalreport' element={<Digitalreport />} />
          <Route path='/parent/updates' element={<Updates />} />
          <Route path='/parent/child/profile/update' element={<ChildProfile />} />
          <Route path='/staff/profilestaff' element={<Profilestaff />} />
          <Route path='/admin/StaffAttendance' element={<StaffAttendance />} />
          <Route path='/parent/events' element={<Notices />} />
          <Route path='/parent/events' element={<Events />} />
          <Route path='/parent/gallery' element={<Gallery />} />
          <Route path='/parent/livestream' element={<LiveStream />} />
          <Route path='/admin/CommonNotices' element={<CommonNotices />} />
          <Route path='/admin/feedback' element={<Feedback />} />
          <Route path='/admin/payments' element={<PaymentsView />} />
          <Route path='/admin/sallary/update' element={<SallaryUpdate />} />
          <Route path='/staff/update/profiles' element={<UpdateChildrend />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/children/attendance' element={<ChildrenAttendance/>} />
          <Route path='/children/mood' element={<ChildrenMood/>} />
          
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
