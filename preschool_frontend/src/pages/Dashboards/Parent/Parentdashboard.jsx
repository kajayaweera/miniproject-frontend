import React, { useState } from 'react';
import '../../../css/parentdash.css';
import Timetable from "./Timetable"; 
import Bedtimestory from './Bedtimestory';
import Billing from './Billing';
import Profilestd from './Profilestd';
import Digitalreport from './Digitalreport';
import Updates from './Updates';
import Notices from './Notices';
import Events from './Events';
import Gallery from './Gallery';
import LiveStream from './LiveStream';
import ChildProfile from './ChildProfile';


function Parentdashboard() {
    const [activeTab, setActiveTab] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Child Profile', icon: '👤' },
        { name: 'Update Child Profile', icon: '👤' },
        { name: 'Timetable', icon: '📅' },
        { name: 'Bedtime Story', icon: '🛌' },
        { name: 'Digital Reports', icon: '📊' },
        { name: 'Updates', icon: '🔔' },
        { name: 'Special Notices', icon: '📝' },
        { name: 'Billing', icon: '💳' },
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
                    <h1 className="dashboard-title">PARENT DASHBOARD</h1>
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
                    <p>&copy; 2025 Preschool System</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                

                {activeTab === 'Home' && (
                    <div className="home-containe">
                        {/* Welcome Banner */}
                        <div className="welcome-banner">
                            <h2>🌟 Welcome to Your Child’s Preschool Journey 🌟</h2>
                            <p>Stay connected with your child’s mood, progress, and daily updates.</p>
                        </div>

                        {/* Info Cards */}
                        <div className="home-cards">
                            <div className="card pink-card">😊 Mood Today: Happy</div>
                            <div className="card white-card">📊 Learning Progress: 75%</div>
                            <div className="card pink-card">📅 Next Event: Christmas Celebration – December 25</div>
                        </div>

                        {/* Announcements */}
                        <div className="announcement-box">
                            <h3>📢 Announcements</h3>
                            <ul>
                                <li>🎉 Family Day scheduled for Sept 20.</li>
                                <li>📸 New photos added to the Gallery.</li>
                                <li>💳 Reminder: Tuition fees due by Sept 15.</li>
                            </ul>
                        </div>
                    </div>
                )}

                

                {activeTab === "Timetable" && <Timetable />}
                {activeTab === "Bedtime Story" && <Bedtimestory />}
                {activeTab === "Billing" && <Billing />}
                {activeTab === "Child Profile" && <Profilestd />}
                {activeTab === "Digital Reports" && <Digitalreport />}
                {activeTab === "Updates" && <Updates />}
                {activeTab === "Special Notices" && <Notices />}
                {activeTab === "Events" && <Events />}
                {activeTab === "Gallery" && <Gallery />}
                {activeTab === "See My Child" && <LiveStream />}
                {activeTab === "Update Child Profile" && <ChildProfile />}
                

{activeTab !== "Home" && activeTab !== "Timetable" &&  activeTab !== "Bedtime Story" && activeTab !== "Billing" && activeTab !== "Child Profile" && activeTab !== "Update Child Profile" && activeTab !== "Digital Reports" && activeTab !== "Updates" && activeTab !== "Special Notices" && activeTab !== "Events" && activeTab !== "Gallery" && activeTab !== "See My Child" &&(
    <div className="content-body">
        <h2 className="content-title">{activeTab}</h2>
        <p className="content-text">
            Content for <b>{activeTab}</b> will appear here.
        </p>
    </div>
)}
            </div>
        </div>
    );
}

export default Parentdashboard;
