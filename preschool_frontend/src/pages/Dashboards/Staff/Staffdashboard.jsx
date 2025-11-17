import React, { useState } from 'react';
import '../../../css/staffdash.css';
import Timetable from "../Parent/Timetable"; 
import Digitalreport from '../Parent/Digitalreport';
import Profilestaff from './Profilestaff';
import Updates from "../Parent/Updates"; 
import Notices from '../Parent/Notices';
import Events from '../Parent/Events';
import Gallery from '../Parent/Gallery';
import UpdateChildrend from './UpdateChildrend';
import Salary from './Salary';

function Staffdashboard() {
    const [activeTab, setActiveTab] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Staff Profile', icon: '👤' },
        { name: 'Timetable', icon: '📅' },
        { name: 'Digital Reports', icon: '📊' },
        { name: 'update profiles', icon: '🔔' },
        { name: 'Special Notices', icon: '📝' },
        { name: 'my salary', icon: '💸' },
        { name: 'Events', icon: '🎉' },
        { name: 'Gallery', icon: '📸' },
        
    ];

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        console.log(`Navigating to: ${tabName}`);
    };

    return (
        <div className="dashboard-wrapper">
            {/* Sidebar */}
            <div className="sidebar-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">STAFF DASHBOARD</h1>
                    <div className="welcome-message">Welcome back! 👋</div>
                </div>

                <nav className="navigation-menu">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`nav-button ${activeTab === item.name ? 'active' : ''}`}
                            onClick={() => handleTabClick(item.name)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="dashboard-footer">
                    <p>&copy; 2025 Staff Portal</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {activeTab === 'Home' && (
                    <div className="staff-home">
                        <h2 className="home-title">🌸 Welcome, Teacher!</h2>
                        <p className="home-subtitle">Here’s a quick glance at your day 👇</p>

                        <div className="home-cards">
                            <div className="card pink-card">
                                <h3>👩‍🏫 Today’s Classes</h3>
                                <p>3 Sessions Scheduled</p>
                            </div>
                            <div className="card white-card">
                                <h3>📊 Reports Pending</h3>
                                <p>2 Reports to Update</p>
                            </div>
                            <div className="card pink-card">
                                <h3>🎉 Upcoming Event</h3>
                                <p>Sports Day – Sept 15</p>
                            </div>
                            <div className="card white-card">
                                <h3>🔔 Notifications</h3>
                                <p>5 New Updates</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Timetable" && <Timetable />}
                {activeTab === "Digital Reports" && <Digitalreport />}
                {activeTab === "Staff Profile" && <Profilestaff />}
                {activeTab === "Updates" && <Updates />}
                {activeTab === "Special Notices" && <Notices />}
                {activeTab === "Events" && <Events />}
                {activeTab === "Gallery" && <Gallery />}
                {activeTab === "update profiles" && <UpdateChildrend />}
                {activeTab === "my salary" && <Salary />}

                {activeTab !== 'Home' && activeTab !== 'Timetable' && activeTab !== 'Digital Reports' && activeTab !== 'Staff Profile' && activeTab !== 'Staff Attendance' && activeTab !== "Updates" && activeTab !== "Special Notices" && activeTab !== "Events" && activeTab !== "update profiles" && activeTab !== "Gallery" &&(
                    <div className="content-body">
                        <h2 className="content-title">{activeTab}</h2>
                        <p className="content-text">
                            Content for <b>{activeTab}</b> will be displayed here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Staffdashboard;
