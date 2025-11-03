import React, { useState } from 'react';
import '../../../css/admindash.css';

function Admindashboard() {
    const [activeTab, setActiveTab] = useState('Home');

    const menuItems = [
        { name: 'Home', icon: '🏠' },
        { name: 'Staff Profile', icon: '👤' },
        { name: 'Timetable', icon: '📅' },
        { name: 'Activities', icon: '🎯' },
        { name: 'Digital Reports', icon: '📊' },
        { name: 'Updates', icon: '🔔' },
        { name: 'Special Notices', icon: '📝' },
        { name: 'Payment', icon: '💳' },
        { name: 'See My Child', icon: '👶' },
        { name: 'Events', icon: '🎉' },
        { name: 'Gallery', icon: '📸' },
        
    ];

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        // Add your navigation logic here
        console.log(`Navigating to: ${tabName}`);
    };

    return (
        <div className="dashboard-wrapper">
            <div className="sidebar-container">
                {/* Header */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title">ADMIN DASHBOARD</h1>
                    <div className="welcome-message">
                        Welcome back! 👋
                    </div>
                </div>

                {/* Navigation Menu */}
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

                {/* Footer */}
                <div className="dashboard-footer">
                    <p>&copy; 2025 Staff Portal</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-header">
                    <h2>{activeTab}</h2>
                </div>

                {activeTab === 'Home' ? (
                    <div className="home-dashboard">
                        {/* Quick Stats */}
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

                        {/* Announcement / Notices */}
                        <div className="announcement-section">
                            <h3>📢 Announcements</h3>
                            <ul>
                                <li>🎯 New staff meeting scheduled for Monday 10 AM.</li>
                                <li>📸 Gallery updated with last week’s event photos.</li>
                                <li>💳 Reminder: Monthly bills due by 15th.</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="content-body">
                        <p>Content for {activeTab} will be displayed here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admindashboard;