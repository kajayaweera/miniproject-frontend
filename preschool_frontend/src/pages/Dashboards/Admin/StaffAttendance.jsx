import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../css/StaffAttendance.css';

export default function StaffAttendance() {
  const [teachers, setTeachers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState('create'); // 'create' or 'history'

  const API_BASE_URL = 'http://localhost:8000/api'; // Update with your API URL

  // Fetch all teachers
  useEffect(() => {
    fetchTeachers();
    fetchAttendanceRecords();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      console.log('Fetching teachers from:', `${API_BASE_URL}/get/teachers`);
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const response = await axios.get(`${API_BASE_URL}/get/teachers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('Teachers response:', response.data);
      
      // Handle both response formats: direct array or {success, data} object
      let teachersData = [];
      if (Array.isArray(response.data)) {
        // Direct array response
        teachersData = response.data;
      } else if (response.data.success && response.data.data) {
        // Object with success and data properties
        teachersData = response.data.data;
      } else if (response.data.data) {
        // Object with just data property
        teachersData = response.data.data;
      }
      
      if (teachersData.length >= 0) {
        setTeachers(teachersData);
        // Initialize attendance data with all teachers as absent
        const initialAttendance = {};
        teachersData.forEach(teacher => {
          initialAttendance[teacher.id] = 'absent';
        });
        setAttendanceData(initialAttendance);
        console.log('Teachers loaded successfully:', teachersData.length);
      } else {
        const errorMsg = response.data.message || 'Failed to fetch teachers';
        console.error('Failed to fetch teachers:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response) {
        // Server responded with error status
        const errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMsg);
      } else if (err.request) {
        // Request made but no response
        setError('No response from server. Please check your connection.');
      } else {
        // Other errors
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      console.log('Fetching attendance records from:', `${API_BASE_URL}/attendances`);
      
      const response = await axios.get(`${API_BASE_URL}/attendances`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      console.log('Attendance records response:', response.data);
      
      if (response.data.success) {
        setAttendanceRecords(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      console.error('Error response:', err.response?.data);
    }
  };

  const handleStatusChange = (teacherId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [teacherId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Transform attendance data to API format
    const attendanceArray = Object.entries(attendanceData).map(([user_id, status]) => ({
      user_id: parseInt(user_id),
      status
    }));

    const payload = {
      date: selectedDate,
      attendance: attendanceArray
    };

    try {
      const url = editMode 
        ? `${API_BASE_URL}/attendances/${editingId}`
        : `${API_BASE_URL}/attendances`;
      
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      };

      const response = editMode 
        ? await axios.put(url, payload, config)
        : await axios.post(url, payload, config);

      if (response.data.success) {
        setSuccess(response.data.message);
        fetchAttendanceRecords();
        resetForm();
      } else {
        setError(response.data.message || 'Failed to save attendance');
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMsg);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (attendanceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendances/${attendanceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        const record = response.data.data;
        setSelectedDate(record.date);
        
        // Transform attendance data back to state format
        const transformedData = {};
        record.attendance.forEach(item => {
          transformedData[item.user_id] = item.status;
        });
        
        // Ensure all current teachers are in the data
        teachers.forEach(teacher => {
          if (!transformedData[teacher.id]) {
            transformedData[teacher.id] = 'absent';
          }
        });
        
        setAttendanceData(transformedData);
        setEditMode(true);
        setEditingId(attendanceId);
        setViewMode('create');
      }
    } catch (err) {
      console.error('Error fetching attendance details:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMsg);
      } else {
        setError('Error fetching attendance details: ' + err.message);
      }
    }
  };

  const handleDelete = async (attendanceId) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/attendances/${attendanceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        fetchAttendanceRecords();
      } else {
        setError('Failed to delete attendance');
      }
    } catch (err) {
      console.error('Error deleting attendance:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response) {
        const errorMsg = err.response.data?.message || `Server error: ${err.response.status}`;
        setError(errorMsg);
      } else {
        setError('Error deleting attendance: ' + err.message);
      }
    }
  };

  const resetForm = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    const initialAttendance = {};
    teachers.forEach(teacher => {
      initialAttendance[teacher.id] = 'absent';
    });
    setAttendanceData(initialAttendance);
    setEditMode(false);
    setEditingId(null);
  };

  const markAllPresent = () => {
    const updatedAttendance = {};
    teachers.forEach(teacher => {
      updatedAttendance[teacher.id] = 'present';
    });
    setAttendanceData(updatedAttendance);
  };

  const markAllAbsent = () => {
    const updatedAttendance = {};
    teachers.forEach(teacher => {
      updatedAttendance[teacher.id] = 'absent';
    });
    setAttendanceData(updatedAttendance);
  };

  return (
    <div className="sa-container">
      <div className="sa-header">
        <h1>Staff Attendance Management</h1>
        <div className="sa-view-toggle">
          <button 
            className={viewMode === 'create' ? 'sa-active' : ''} 
            onClick={() => setViewMode('create')}
          >
            {editMode ? 'Edit Attendance' : 'Mark Attendance'}
          </button>
          <button 
            className={viewMode === 'history' ? 'sa-active' : ''} 
            onClick={() => setViewMode('history')}
          >
            Attendance History
          </button>
        </div>
      </div>

      {error && <div className="sa-alert sa-alert-error">{error}</div>}
      {success && <div className="sa-alert sa-alert-success">{success}</div>}

      {viewMode === 'create' ? (
        <div className="sa-form-section">
          <form onSubmit={handleSubmit} className="sa-form">
            <div className="sa-form-header">
              <div className="sa-form-group">
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="sa-bulk-actions">
                <button type="button" onClick={markAllPresent} className="sa-btn-secondary">
                  Mark All Present
                </button>
                <button type="button" onClick={markAllAbsent} className="sa-btn-secondary">
                  Mark All Absent
                </button>
                {editMode && (
                  <button type="button" onClick={resetForm} className="sa-btn-secondary">
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            <div className="sa-teachers-list">
              <div className="sa-list-header">
                <span className="sa-teacher-name-header">Teacher Name</span>
                <span className="sa-status-header">Status</span>
              </div>
              {teachers.map(teacher => (
                <div key={teacher.id} className="sa-teacher-item">
                  <div className="sa-teacher-info">
                    <span className="sa-teacher-name">{teacher.name}</span>
                    <span className="sa-teacher-email">{teacher.email}</span>
                  </div>
                  <div className="sa-status-controls">
                    <label className="sa-radio-label">
                      <input
                        type="radio"
                        name={`teacher-${teacher.id}`}
                        value="present"
                        checked={attendanceData[teacher.id] === 'present'}
                        onChange={() => handleStatusChange(teacher.id, 'present')}
                      />
                      <span className="sa-status-present">Present</span>
                    </label>
                    <label className="sa-radio-label">
                      <input
                        type="radio"
                        name={`teacher-${teacher.id}`}
                        value="absent"
                        checked={attendanceData[teacher.id] === 'absent'}
                        onChange={() => handleStatusChange(teacher.id, 'absent')}
                      />
                      <span className="sa-status-absent">Absent</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="sa-form-actions">
              <button type="submit" className="sa-btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editMode ? 'Update Attendance' : 'Submit Attendance')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="sa-history-section">
          <h2>Attendance History</h2>
          {attendanceRecords.length === 0 ? (
            <p className="sa-no-records">No attendance records found.</p>
          ) : (
            <div className="sa-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Present</th>
                    <th>Total Absent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map(record => {
                    const attendanceArray = Object.values(record.attendance);
                    const presentCount = attendanceArray.filter(status => status === 'present').length;
                    const absentCount = attendanceArray.filter(status => status === 'absent').length;
                    
                    return (
                      <tr key={record.id}>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td className="sa-present-count">{presentCount}</td>
                        <td className="sa-absent-count">{absentCount}</td>
                        <td className="sa-action-buttons">
                          <button 
                            onClick={() => handleEdit(record.id)} 
                            className="sa-btn-edit">
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)} 
                            className="sa-btn-delete">
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}