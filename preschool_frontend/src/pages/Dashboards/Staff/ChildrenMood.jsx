import axios from "axios";
import { useEffect, useState } from "react";
import "../../Auth/Register.css"; // Reusing styles

export default function ChildrenMood() {
    const [profiles, setProfiles] = useState([]);
    const [moodRecords, setMoodRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [childMoods, setChildMoods] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState(null);

    const moodOptions = [
        { value: 'happy', emoji: '😊', label: 'Happy' },
        { value: 'sad', emoji: '😢', label: 'Sad' },
        { value: 'angry', emoji: '😠', label: 'Angry' },
        { value: 'excited', emoji: '🤩', label: 'Excited' },
        { value: 'calm', emoji: '😌', label: 'Calm' },
        { value: 'anxious', emoji: '😰', label: 'Anxious' },
        { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
        { value: 'content', emoji: '😊', label: 'Content' },
        { value: 'tired', emoji: '😴', label: 'Tired' },
        { value: 'energetic', emoji: '⚡', label: 'Energetic' }
    ];

    // Fetch all child profiles
    async function getAllProfiles() {
        try {
            setLoading(true);
            const res = await axios.get('/api/child-profiles');
            setProfiles(res.data);
            
            // Initialize mood state for each child
            const initialMoods = {};
            res.data.forEach(child => {
                initialMoods[child.id] = '';
            });
            setChildMoods(initialMoods);
        } catch (error) {
            console.error("Error fetching profiles:", error);
            setMessage("Failed to load child profiles");
        } finally {
            setLoading(false);
        }
    }

    // Fetch mood history
    async function getMoodHistory() {
        try {
            const res = await axios.get('/api/moods');
            setMoodRecords(res.data.data || []);
        } catch (error) {
            console.error("Error fetching mood records:", error);
            setMessage("Failed to load mood history");
        }
    }

    // Handle mood selection for a child
    const handleMoodSelect = (childId, mood) => {
        setChildMoods(prev => ({
            ...prev,
            [childId]: prev[childId] === mood ? '' : mood
        }));
    };

    // Set all children to happy mood
    const setAllHappy = () => {
        const allHappyMoods = {};
        profiles.forEach(child => {
            allHappyMoods[child.id] = 'happy';
        });
        setChildMoods(allHappyMoods);
        setMessage("All children set to happy! 😊");
        setTimeout(() => setMessage(""), 2000);
    };

    // Check if a record exists for the selected date
    const getExistingRecordForDate = (date) => {
        return moodRecords.find(r => r.date === date);
    };

    // Load existing mood record for editing
    const loadRecordForEditing = (record) => {
        setEditingRecordId(record.id);
        const moodsForEdit = {};
        profiles.forEach(child => {
            moodsForEdit[child.id] = '';
        });
        record.mood.forEach(moodEntry => {
            moodsForEdit[moodEntry.child_profile_id] = moodEntry.mood;
        });
        setChildMoods(moodsForEdit);
        setSelectedDate(record.date);
        setShowHistory(false);
        setMessage("Editing record for " + new Date(record.date).toLocaleDateString());
        setTimeout(() => setMessage(""), 3000);
    };

    // Delete a mood record
    const deleteMoodRecord = async (recordId) => {
        if (!window.confirm('Are you sure you want to delete this mood record?')) {
            return;
        }
        
        try {
            await axios.delete(`/api/moods/${recordId}`);
            setMessage("Mood record deleted successfully!");
            getMoodHistory();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error deleting mood record:", error);
            setMessage("Failed to delete mood record");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    // Update an existing mood record
    const updateMoodRecord = async () => {
        try {
            const moodData = Object.entries(childMoods)
                .filter(([_, mood]) => mood !== '')
                .map(([child_profile_id, mood]) => ({
                    child_profile_id: parseInt(child_profile_id),
                    mood
                }));

            if (moodData.length === 0) {
                setMessage("Please select at least one child's mood");
                setTimeout(() => setMessage(""), 3000);
                return;
            }

            const payload = {
                date: selectedDate,
                mood: moodData
            };

            await axios.put(`/api/moods/${editingRecordId}`, payload);
            
            setMessage("Mood record updated successfully!");
            setEditingRecordId(null);
            
            // Reset selections
            const resetMoods = {};
            profiles.forEach(child => {
                resetMoods[child.id] = '';
            });
            setChildMoods(resetMoods);
            
            getMoodHistory();
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error updating mood record:", error);
            setMessage(error.response?.data?.message || "Failed to update mood record");
            setTimeout(() => setMessage(""), 5000);
        }
    };

    // Submit all moods for the selected date
    async function submitMoods() {
        try {
            // Check if a record already exists for this date
            const existingRecord = getExistingRecordForDate(selectedDate);
            if (existingRecord) {
                setMessage("A record already exists for this date. Please edit or delete it first.");
                setTimeout(() => setMessage(""), 5000);
                return;
            }

            // Filter out children without mood selected
            const moodData = Object.entries(childMoods)
                .filter(([_, mood]) => mood !== '')
                .map(([child_profile_id, mood]) => ({
                    child_profile_id: parseInt(child_profile_id),
                    mood
                }));

            if (moodData.length === 0) {
                setMessage("Please select at least one child's mood");
                setTimeout(() => setMessage(""), 3000);
                return;
            }

            const payload = {
                date: selectedDate,
                mood: moodData
            };

            const res = await axios.post('/api/moods', payload);
            
            setMessage(res.data.message || "Moods recorded successfully!");
            
            // Reset selections
            const resetMoods = {};
            profiles.forEach(child => {
                resetMoods[child.id] = '';
            });
            setChildMoods(resetMoods);
            
            // Refresh history
            getMoodHistory();
            
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error("Error submitting moods:", error);
            setMessage(error.response?.data?.message || "Failed to record moods");
            setTimeout(() => setMessage(""), 5000);
        }
    }

    // Get emoji for mood value
    const getMoodEmoji = (moodValue) => {
        const mood = moodOptions.find(m => m.value === moodValue);
        return mood ? mood.emoji : '😐';
    };

    // Get children moods for a specific date
    const getMoodsForDate = (date) => {
        const record = moodRecords.find(r => r.date === date);
        return record?.mood || [];
    };

    useEffect(() => {
        getAllProfiles();
        getMoodHistory();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: '#4A90E2', marginBottom: '10px' }}>
                😊 Children's Mood Tracker 😊
            </h1>
            
            {editingRecordId && (
                <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: '#FF9800',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    ✏️ EDITING MODE: You are currently editing a mood record
                </div>
            )}
            
            {message && (
                <div style={{
                    padding: '15px',
                    marginBottom: '20px',
                    backgroundColor: message.includes('Failed') || message.includes('Error') || message.includes('exists') ? '#ff4444' : '#4CAF50',
                    color: 'white',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {message}
                </div>
            )}

            {/* Date Selector */}
            <div style={{ 
                marginBottom: '30px', 
                textAlign: 'center',
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <label style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    Select Date:
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                        const newDate = e.target.value;
                        setSelectedDate(newDate);
                        const existingRecord = getExistingRecordForDate(newDate);
                        if (existingRecord && !editingRecordId) {
                            setMessage(`⚠️ A record already exists for ${new Date(newDate).toLocaleDateString()}. View history to edit or delete it.`);
                            setTimeout(() => setMessage(""), 5000);
                        }
                    }}
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
                    <button
                        onClick={setAllHappy}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#FFD700',
                            color: '#333',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        😊 Set All Happy
                    </button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', fontSize: '20px', padding: '50px' }}>
                    Loading...
                </div>
            ) : showHistory ? (
                // Mood History View
                <div>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Mood History</h2>
                    {moodRecords.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>No mood records found</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {moodRecords.map((record) => (
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
                                        <h3 style={{ margin: 0, color: '#4A90E2' }}>
                                            Date: {new Date(record.date).toLocaleDateString()}
                                        </h3>
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
                                                onClick={() => deleteMoodRecord(record.id)}
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
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                        gap: '15px'
                                    }}>
                                        {record.mood.map((moodEntry, idx) => {
                                            const child = profiles.find(p => p.id === moodEntry.child_profile_id);
                                            return (
                                                <div 
                                                    key={idx}
                                                    style={{
                                                        padding: '10px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '8px',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '40px', marginBottom: '5px' }}>
                                                        {getMoodEmoji(moodEntry.mood)}
                                                    </div>
                                                    <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                                        {child?.name || 'Unknown'}
                                                    </p>
                                                    <p style={{ color: '#666', textTransform: 'capitalize' }}>
                                                        {moodEntry.mood}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                // Current Day Mood Recording
                <>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        {profiles.map((child) => (
                            <div 
                                key={child.id} 
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    border: '2px solid #e0e0e0'
                                }}
                            >
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    marginBottom: '15px',
                                    gap: '15px'
                                }}>
                                    {child.profile_pic && (
                                        <img 
                                            src={child.profile_pic} 
                                            alt={child.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    )}
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{child.name}</h3>
                                        <p style={{ margin: 0, color: '#666' }}>Age: {child.age}</p>
                                    </div>
                                </div>
                                
                                <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(5, 1fr)',
                                    gap: '10px',
                                    marginTop: '15px'
                                }}>
                                    {moodOptions.map((mood) => (
                                        <button
                                            key={mood.value}
                                            onClick={() => handleMoodSelect(child.id, mood.value)}
                                            style={{
                                                padding: '10px',
                                                fontSize: '28px',
                                                border: childMoods[child.id] === mood.value 
                                                    ? '3px solid #4A90E2' 
                                                    : '2px solid #ddd',
                                                borderRadius: '8px',
                                                backgroundColor: childMoods[child.id] === mood.value 
                                                    ? '#E3F2FD' 
                                                    : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                            title={mood.label}
                                        >
                                            <span>{mood.emoji}</span>
                                            <span style={{ 
                                                fontSize: '10px', 
                                                textTransform: 'capitalize'
                                            }}>
                                                {mood.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                
                                {childMoods[child.id] && (
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '10px',
                                        backgroundColor: '#E8F5E9',
                                        borderRadius: '8px',
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                        color: '#2E7D32'
                                    }}>
                                        Selected: {getMoodEmoji(childMoods[child.id])} {
                                            moodOptions.find(m => m.value === childMoods[child.id])?.label
                                        }
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        {editingRecordId ? (
                            <>
                                <button
                                    onClick={updateMoodRecord}
                                    disabled={Object.values(childMoods).every(mood => mood === '')}
                                    style={{
                                        padding: '15px 40px',
                                        fontSize: '18px',
                                        backgroundColor: Object.values(childMoods).every(mood => mood === '') 
                                            ? '#ccc' 
                                            : '#FF9800',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: Object.values(childMoods).every(mood => mood === '') 
                                            ? 'not-allowed' 
                                            : 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ✏️ Update Moods for {new Date(selectedDate).toLocaleDateString()}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditingRecordId(null);
                                        const resetMoods = {};
                                        profiles.forEach(child => {
                                            resetMoods[child.id] = '';
                                        });
                                        setChildMoods(resetMoods);
                                        setSelectedDate(new Date().toISOString().split('T')[0]);
                                        setMessage("Edit cancelled");
                                        setTimeout(() => setMessage(""), 2000);
                                    }}
                                    style={{
                                        padding: '15px 40px',
                                        fontSize: '18px',
                                        backgroundColor: '#6c757d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ❌ Cancel Edit
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={submitMoods}
                                disabled={Object.values(childMoods).every(mood => mood === '')}
                                style={{
                                    padding: '15px 40px',
                                    fontSize: '18px',
                                    backgroundColor: Object.values(childMoods).every(mood => mood === '') 
                                        ? '#ccc' 
                                        : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: Object.values(childMoods).every(mood => mood === '') 
                                        ? 'not-allowed' 
                                        : 'pointer',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    transition: 'all 0.3s'
                                }}
                            >
                                💾 Save Moods for {new Date(selectedDate).toLocaleDateString()}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}