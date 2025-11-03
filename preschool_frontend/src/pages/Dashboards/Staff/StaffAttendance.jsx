import "../../../css/StaffAttendance.css";





import React, { useState } from "react";


const StaffAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [attendanceData, setAttendanceData] = useState([
    { id: 1, name: "Ms. Kavindi Perera", status: "Present" },
    { id: 2, name: "Mr. Nimal Silva", status: "Absent" },
    { id: 3, name: "Ms. Ruwani Fernando", status: "Present" },
  ]);

  const handleAttendanceChange = (id, newStatus) => {
    setAttendanceData(
      attendanceData.map((staff) =>
        staff.id === id ? { ...staff, status: newStatus } : staff
      )
    );
  };

  return (
    <div className="attendance-container">
      <h2>Staff Attendance</h2>

      <div className="attendance-date">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((staff) => (
            <tr key={staff.id}>
              <td>{staff.name}</td>
              <td>
                <select
                  value={staff.status}
                  onChange={(e) =>
                    handleAttendanceChange(staff.id, e.target.value)
                  }
                  className={`status-select ${
                    staff.status === "Present" ? "present" : "absent"
                  }`}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Leave">Leave</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-box">
        <p>
          ✅ <strong>Total Present:</strong>{" "}
          {attendanceData.filter((s) => s.status === "Present").length}
        </p>
        <p>
          ❌ <strong>Total Absent:</strong>{" "}
          {attendanceData.filter((s) => s.status === "Absent").length}
        </p>
      </div>
    </div>
  );
};

export default StaffAttendance;
