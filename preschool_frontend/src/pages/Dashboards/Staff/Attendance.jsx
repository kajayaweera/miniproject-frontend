import axios from "axios";
import { useEffect, useState } from "react";
import "./Attendance.css";

export default function ChildrenAttendance(){

    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [existingRecordId, setExistingRecordId] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    async function getAllProfiles(){
        try {
            setLoading(true);
            const res = await axios.get('/api/child-profiles');
            setProfiles(res.data);
            console.log("Child profiles:", res.data);
            
            // Initialize attendance status for each child
            const initialStatus = {};
            res.data.forEach(child => {
                initialStatus[child.id] = 'absent'; // Default to absent
            });
            setAttendanceStatus(initialStatus);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            setMessage("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    }

    async function getAttendanceRecords(){
        try {
            const res = await axios.get('/api/child-attendances');
            console.log("Attendance records:", res.data);
            if (res.data.success) {
                setAttendanceRecords(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        }
    }

    async function checkExistingAttendance(date){
        try {
            const res = await axios.get('/api/child-attendances');
            if (res.data.success) {
                const existing = res.data.data.find(record => record.date === date);
                if (existing) {
                    setExistingRecordId(existing.id);
                    // Load existing attendance
                    const loadedStatus = {};
                    profiles.forEach(child => {
                        loadedStatus[child.id] = existing.attendance[child.id] || 'absent';
                    });
                    setAttendanceStatus(loadedStatus);
                    setMessage(`Editing attendance for ${new Date(date).toLocaleDateString()}`);
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    setExistingRecordId(null);
                    // Reset to default absent
                    const resetStatus = {};
                    profiles.forEach(child => {
                        resetStatus[child.id] = 'absent';
                    });
                    setAttendanceStatus(resetStatus);
                }
            }
        } catch (error) {
            console.error("Error checking existing attendance:", error);
        }
    }

    const toggleAttendance = (childId) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [childId]: prev[childId] === 'present' ? 'absent' : 'present'
        }));
    };

    const markAllPresent = () => {
        const allPresent = {};
        profiles.forEach(child => {
            allPresent[child.id] = 'present';
        });
        setAttendanceStatus(allPresent);
        setMessage("All children marked as present!");
        setTimeout(() => setMessage(""), 2000);
    };

    const markAllAbsent = () => {
        const allAbsent = {};
        profiles.forEach(child => {
            allAbsent[child.id] = 'absent';
        });
        setAttendanceStatus(allAbsent);
        setMessage("All children marked as absent!");
        setTimeout(() => setMessage(""), 2000);
    };

    async function submitAttendance(){
        try {
            // Prepare attendance data
            const attendanceData = Object.entries(attendanceStatus).map(([child_profile_id, status]) => ({
                child_profile_id: parseInt(child_profile_id),
                status
            }));

            const payload = {
                date: selectedDate,
                attendance: attendanceData
            };

            let res;
            if (existingRecordId) {
                // Update existing record
                res = await axios.put(`/api/child-attendances/${existingRecordId}`, payload);
                setMessage("Attendance updated successfully!");
            } else {
                // Create new record
                res = await axios.post('/api/child-attendances', payload);
                setMessage("Attendance recorded successfully!");
            }
            
            console.log("Attendance response:", res.data);
            getAttendanceRecords();
            
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error submitting attendance:", error);
            const errorMsg = error.response?.data?.message || "Failed to record attendance";
            setMessage(errorMsg);
            setTimeout(() => setMessage(""), 5000);
        }
    }

    async function deleteAttendance(recordId){
        if (!window.confirm('Are you sure you want to delete this attendance record?')) {
            return;
        }
        
        try {
            await axios.delete(`/api/child-attendances/${recordId}`);
            setMessage("Attendance record deleted successfully!");
            getAttendanceRecords();
            
            // If deleted current date's record, reset
            if (recordId === existingRecordId) {
                setExistingRecordId(null);
                const resetStatus = {};
                profiles.forEach(child => {
                    resetStatus[child.id] = 'absent';
                });
                setAttendanceStatus(resetStatus);
            }
            
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error deleting attendance:", error);
            setMessage("Failed to delete attendance record");
            setTimeout(() => setMessage(""), 5000);
        }
    }

    const loadRecordForEditing = (record) => {
        setSelectedDate(record.date);
        setExistingRecordId(record.id);
        
        const loadedStatus = {};
        profiles.forEach(child => {
            loadedStatus[child.id] = record.attendance[child.id] || 'absent';
        });
        setAttendanceStatus(loadedStatus);
        setShowHistory(false);
        setMessage(`Editing attendance for ${new Date(record.date).toLocaleDateString()}`);
        setTimeout(() => setMessage(""), 3000);
    };

    useEffect(() => {
        getAllProfiles();
        getAttendanceRecords();
    }, []);

    useEffect(() => {
        if (profiles.length > 0) {
            checkExistingAttendance(selectedDate);
        }
    }, [selectedDate, profiles]);
    
    return (
        <div className="att-main-container">
            <h1 className="att-page-title">🙋Children Attendance🙋‍♀️</h1>
            
            {message && (
                <div className="att-message-box" style={{
                    backgroundColor: message.includes('Failed') || message.includes('Error') ? '#ff4444' : '#4CAF50'
                }}>
                    {message}
                </div>
            )}

            {/* Date Selector and Actions */}
            <div style={{ 
                display: 'flex', 
                gap: '15px', 
                justifyContent: 'center', 
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap'
            }}>
                <label style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Select Date:
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '2px solid #4A90E2'
                    }}
                />
                
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    {showHistory ? 'Hide History' : 'Show History'}
                </button>

                {!showHistory && (
                    <>
                        <button
                            onClick={markAllPresent}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            ✓ Mark All Present
                        </button>
                        
                        <button
                            onClick={markAllAbsent}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }}
                        >
                            ✗ Mark All Absent
                        </button>
                    </>
                )}
            </div>

            {loading ? (
                <div className="att-loading-state">Loading...</div>
            ) : showHistory ? (
                // Attendance History View
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Attendance History</h2>
                    {attendanceRecords.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>No attendance records found</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {attendanceRecords.map((record) => {
                                const attendanceArray = Object.entries(record.attendance);
                                const presentCount = attendanceArray.filter(([_, status]) => status === 'present').length;
                                const totalCount = attendanceArray.length;
                                
                                return (
                                    <div 
                                        key={record.id} 
                                        style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: '20px',
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: '15px'
                                        }}>
                                            <div>
                                                <h3 style={{ margin: 0, color: '#4A90E2' }}>
                                                    Date: {new Date(record.date).toLocaleDateString()}
                                                </h3>
                                                <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                                                    Present: {presentCount} / {totalCount}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => loadRecordForEditing(record)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#4A90E2',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteAttendance(record.id)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div style={{ 
                                            display: 'grid', 
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                            gap: '10px'
                                        }}>
                                            {attendanceArray.map(([childId, status]) => {
                                                const child = profiles.find(p => p.id === parseInt(childId));
                                                return (
                                                    <div 
                                                        key={childId}
                                                        style={{
                                                            padding: '10px',
                                                            backgroundColor: status === 'present' ? '#d4edda' : '#f8d7da',
                                                            borderRadius: '8px',
                                                            textAlign: 'center',
                                                            border: `2px solid ${status === 'present' ? '#28a745' : '#dc3545'}`
                                                        }}
                                                    >
                                                        <p style={{ 
                                                            fontWeight: 'bold', 
                                                            marginBottom: '5px',
                                                            fontSize: '14px'
                                                        }}>
                                                            {child?.name || 'Unknown'}
                                                        </p>
                                                        <p style={{ 
                                                            color: status === 'present' ? '#28a745' : '#dc3545',
                                                            textTransform: 'capitalize',
                                                            fontWeight: 'bold',
                                                            margin: 0
                                                        }}>
                                                            {status === 'present' ? '✓ Present' : '✗ Absent'}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="att-cards-grid">
                        {profiles.map((child) => (
                            <div 
                                key={child.id} 
                                className="att-child-card"
                                style={{
                                    border: attendanceStatus[child.id] === 'present' 
                                        ? '3px solid #28a745' 
                                        : '3px solid #dc3545'
                                }}
                            >
                                <div className="att-card-header">
                                    {child.profile_pic && (
                                        <img 
                                            src={child.profile_pic} 
                                            alt={child.name}
                                            className="att-child-avatar"
                                        />
                                    )}
                                    <div className="att-child-details">
                                        <h3>{child.name}</h3>
                                        <p>Age: {child.age}</p>
                                    </div>
                                </div>
                                
                                <div className="att-status-wrapper">
                                    <span className={`att-status-label ${attendanceStatus[child.id] === 'present' ? 'att-present' : 'att-absent'}`}>
                                        {attendanceStatus[child.id] === 'present' ? '✓ Present' : '✗ Absent'}
                                    </span>
                                </div>

                                <div className="att-action-buttons">
                                    <button 
                                        className="att-btn-mark-present"
                                        onClick={() => toggleAttendance(child.id)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            backgroundColor: attendanceStatus[child.id] === 'present' ? '#28a745' : '#6c757d',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {attendanceStatus[child.id] === 'present' ? '✓ Present' : 'Mark Present'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {profiles.length > 0 && (
                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <button
                                onClick={submitAttendance}
                                style={{
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    backgroundColor: existingRecordId ? '#FF9800' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {existingRecordId ? '📝 Update Attendance' : '💾 Save Attendance'} for {new Date(selectedDate).toLocaleDateString()}
                            </button>
                        </div>
                    )}
                </>
            )}

            {!loading && profiles.length === 0 && (
                <div className="att-no-data">No children profiles found</div>
            )}
        </div>
    );
}