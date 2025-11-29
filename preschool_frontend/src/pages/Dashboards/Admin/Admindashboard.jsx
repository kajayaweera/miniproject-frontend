import React, { useState } from 'react';
import '../../../css/admindash.css';
import Timetable from "../Parent/Timetable"; 
import StaffAttendance from './StaffAttendance';

import Notices from '../Parent/Notices';
import Events from '../Parent/Events';
import Gallery from '../Parent/Gallery';
import LiveStream from '../Parent/LiveStream';
import CommonNotices from './CommonNotices';
import Feedback from './Feedback';
import PaymentsView from './PaymentsView';
import SallaryUpdate from './SallaryUpdate';


function Admindashboard() {
    const [activeTab, setActiveTab] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Staff Attendance', icon: '☑️' },
        { name: 'Timetable', icon: '📅' },
        
        { name: 'Special Notices', icon: '📝' },
        { name: 'Common Notices', icon: '📝' },
        { name: 'Feedbacks', icon: '✉️' },
        { name: 'received payments', icon: '💳' },
        { name: 'Staff Salaries', icon: '💳' },
        { name: 'See My Child', icon: '👶' },
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
                    <h1 className="dashboard-title">ADMIN DASHBOARD</h1>
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
                

                {/* Home Section */}
                {activeTab === 'Home' && (
                    <div className="home-dashboard">
                        <div className="stats-grid">
                            <div className="stat-card pink-card">
                                <h3>👩‍🏫 8</h3>
                                <p>Active Staff</p>
                            </div>
                            <div className="stat-card white-card">
                                <h3>👶 205</h3>
                                <p>Enrolled Children</p>
                            </div>
                            <div className="stat-card pink-card">
                                <h3>🎉 5</h3>
                                <p>Upcoming Events</p>
                            </div>
                            <div className="stat-card white-card">
                                <h3>💳 12</h3>
                                <p>Pending Bills</p>
                            </div>
                        </div>

                        <div className="announcement-section">
                            <h3>📢 Announcements</h3>
                            <ul>
                                <li>🎯 New staff meeting scheduled for Monday 10 AM.</li>
                                <li>📸 Gallery updated with last week’s event photos.</li>
                                <li>💳 Reminder: Monthly bills due by 15th.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeTab === "Timetable" && <Timetable />}
                {activeTab === 'Staff Attendance' && <StaffAttendance />}
                
                {activeTab === "Special Notices" && <Notices />}
                {activeTab === "Events" && <Events />}
                {activeTab === "See My Child" && <LiveStream />}
                {activeTab === "Gallery" && <Gallery />}
                {activeTab === "Common Notices" && <CommonNotices />}
                {activeTab === "Feedbacks" && <Feedback />}
                {activeTab === "received payments" && <PaymentsView />}
                {activeTab === "Staff Salaries" && <SallaryUpdate />}
               

                
                {activeTab !== 'Home' && activeTab !== 'Staff Attendance' &&  activeTab !== "Special Notices" && activeTab !== "Events" && activeTab !== "Gallery" && activeTab !== 'Timetable' && activeTab !== "See My Child" && activeTab !== "Common Notices" && activeTab !== "Feedbacks" && activeTab !== "received payments" && activeTab !== "Staff Salaries" &&  (
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

export default Admindashboard;
