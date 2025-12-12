import axios from "axios";
import { useEffect, useState } from "react";
import "./Attendance.css";

export default function ChildrenAttendance(){

    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function getAllProfiles(){
        try {
            setLoading(true);
            const res = await axios.get('/api/child-profiles');
            setProfiles(res.data);
            console.log(res.data);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            setMessage("Failed to load profiles");
        } finally {
            setLoading(false);
        }
    }

    async function submitAttendance(id, isPresent){
        try {
            const res = await axios.put(`/api/child-profiles/${id}`, {
                attendance: isPresent
            });
            
            setMessage(`Attendance updated successfully for ${res.data.name}`);
            getAllProfiles(); // Refresh the list
            
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error updating attendance:", error);
            setMessage("Failed to update attendance");
        }
    }

    useEffect(() => {
        getAllProfiles();
    }, []);
    
    return (
        <div className="att-main-container">
            <h1 className="att-page-title">🙋Children Attendance🙋‍♀️</h1>
            
            {message && (
                <div className="att-message-box">
                    {message}
                </div>
            )}

            {loading ? (
                <div className="att-loading-state">Loading...</div>
            ) : (
                <div className="att-cards-grid">
                    {profiles.map((child) => (
                        <div key={child.id} className="att-child-card">
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
                                <span className={`att-status-label ${child.attendance ? 'att-present' : 'att-absent'}`}>
                                    {child.attendance ? 'Present' : 'Absent'}
                                </span>
                            </div>

                            <div className="att-action-buttons">
                                <button 
                                    className="att-btn-mark-present"
                                    onClick={() => submitAttendance(child.id, true)}
                                    disabled={child.attendance === true}
                                >
                                    Mark Present
                                </button>
                                <button 
                                    className="att-btn-mark-absent"
                                    onClick={() => submitAttendance(child.id, false)}
                                    disabled={child.attendance === false}
                                >
                                    Mark Absent
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && profiles.length === 0 && (
                <div className="att-no-data">No children profiles found</div>
            )}
        </div>
    );
}