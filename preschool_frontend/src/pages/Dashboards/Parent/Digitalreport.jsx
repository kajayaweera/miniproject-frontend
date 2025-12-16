import React, { useState, useRef, useContext, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import "../../../css/Digitalreport.css";
import { AppContext } from "../../../Context/AppProvider";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Digitalreport = () => {
  const [selectedReport, setSelectedReport] = useState("attendance");
  const reportRef = useRef(null);
  const {user} = useContext(AppContext);
  const [moodStats, setMoodStats] = useState({ labels: [], data: [] });
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0, total_days: 0, attendance_rate: 0 });
  const [loading, setLoading] = useState(true);

  // Fetch attendance statistics from backend
  const fetchAttendanceStatistics = async () => {
    if (!user?.id) {
      console.log("No user ID available");
      setAttendanceStats({ present: 0, absent: 0, total_days: 0, attendance_rate: 0 });
      return;
    }

    try {
      const res = await axios.get(`/api/child-attendance/statistics/${user.id}`);
      console.log("Attendance Statistics API Response:", res.data);
      
      if (res?.data?.success && res?.data?.data) {
        const data = res.data.data;
        setAttendanceStats({
          present: Number(data.present) || 0,
          absent: Number(data.absent) || 0,
          total_days: Number(data.total_days) || 0,
          attendance_rate: Number(data.attendance_rate) || 0
        });
      } else {
        setAttendanceStats({ present: 0, absent: 0, total_days: 0, attendance_rate: 0 });
      }
    } catch (error) {
      console.error("Error fetching attendance statistics:", error);
      setAttendanceStats({ present: 0, absent: 0, total_days: 0, attendance_rate: 0 });
    }
  };

  // Fetch mood statistics from backend
  const fetchMoodStatistics = async () => {
    if (!user?.id) {
      console.log("No user ID available");
      setMoodStats({ labels: [], data: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/api/mood/statistics/${user.id}`);
      console.log("Mood Statistics API Response:", res.data);
      
      if (res?.data?.success && res?.data?.data) {
        const labels = Array.isArray(res.data.data.labels) ? res.data.data.labels : [];
        const data = Array.isArray(res.data.data.data) ? res.data.data.data : [];
        
        setMoodStats({
          labels: labels,
          data: data
        });
      } else {
        setMoodStats({ labels: [], data: [] });
      }
    } catch (error) {
      console.error("Error fetching mood statistics:", error);
      setMoodStats({ labels: [], data: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAttendanceStatistics();
      fetchMoodStatistics();
    }
  }, [user]);

  // Generate attendance summary based on statistics
  const generateAttendanceSummary = () => {
    try {
      if (!attendanceStats || attendanceStats.total_days === 0) {
        return "No attendance data available yet. Attendance tracking will appear here once records are added.";
      }

      const rate = Number(attendanceStats.attendance_rate) || 0;
      const present = Number(attendanceStats.present) || 0;
      const absent = Number(attendanceStats.absent) || 0;
      const totalDays = Number(attendanceStats.total_days) || 0;
      
      let performance = "";
      
      if (rate >= 90) {
        performance = "excellent";
      } else if (rate >= 75) {
        performance = "good";
      } else if (rate >= 60) {
        performance = "average";
      } else {
        performance = "needs improvement";
      }

      return `Your child has been marked ${present} time(s) present and ${absent} time(s) absent out of ${totalDays} total day(s) tracked. This gives an attendance rate of ${rate}%, which is ${performance}. Consistent presence helps with learning continuity and social development.`;
    } catch (error) {
      console.error("Error generating attendance summary:", error);
      return "Unable to generate attendance summary at this time.";
    }
  };

  // Generate mood summary based on statistics
  const generateMoodSummary = () => {
    try {
      if (!moodStats || !Array.isArray(moodStats.data) || moodStats.data.length === 0) {
        return "No mood data available yet. Mood tracking will appear here once records are added.";
      }

      const totalMoods = moodStats.data.reduce((sum, count) => sum + (Number(count) || 0), 0);
      if (totalMoods === 0) {
        return "No mood records found. Start tracking your child's mood to see statistics here.";
      }

      const maxValue = Math.max(...moodStats.data.map(d => Number(d) || 0));
      const maxIndex = moodStats.data.findIndex(d => (Number(d) || 0) === maxValue);
      
      if (maxIndex === -1 || !Array.isArray(moodStats.labels) || !moodStats.labels[maxIndex]) {
        return "Mood data is being tracked. Summary will be available once more data is collected.";
      }

      const dominantMood = moodStats.labels[maxIndex];
      const percentage = ((maxValue / totalMoods) * 100).toFixed(1);

      return `Your child's mood has been tracked ${totalMoods} time(s). The most frequent mood is "${dominantMood}" (${percentage}%). This helps us understand your child's emotional patterns and well-being over time.`;
    } catch (error) {
      console.error("Error generating mood summary:", error);
      return "Unable to generate mood summary at this time.";
    }
  };

  const reports = {
    attendance: {
      title: "Attendance Statistics",
      labels: ["Present", "Absent"],
      data: [Number(attendanceStats?.present) || 0, Number(attendanceStats?.absent) || 0],
      color: "rgba(75, 192, 192, 0.7)",
      summary: generateAttendanceSummary(),
    },
    mood: {
      title: "Mood Statistics",
      labels: Array.isArray(moodStats?.labels) 
        ? moodStats.labels.map(label => {
            try {
              return String(label).charAt(0).toUpperCase() + String(label).slice(1);
            } catch {
              return String(label) || 'Unknown';
            }
          })
        : [],
      data: Array.isArray(moodStats?.data) ? moodStats.data.map(d => Number(d) || 0) : [],
      color: "rgba(153, 102, 255, 0.7)",
      summary: generateMoodSummary(),
    },
  };

  const currentReport = reports[selectedReport] || reports.attendance;

  const chartData = {
    labels: Array.isArray(currentReport?.labels) ? currentReport.labels : [],
    datasets: [
      {
        label: currentReport?.title || 'Statistics',
        data: currentReport.data,
        backgroundColor: currentReport.color,
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: currentReport.title,
        font: { size: 18 },
      },
    },
  };

  // 📄 Convert the report section to a downloadable PDF
  const downloadPDF = async () => {
    try {
      const element = reportRef.current;
      if (!element) {
        console.error("Report element not found");
        alert("Unable to generate PDF. Please try again.");
        return;
      }

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
      const fileName = `${currentReport?.title || 'Report'}_Report.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again later.");
    }
  };

  return (
    <div className="digital-report-container">
      <h2>📊Child Digital Report</h2>

      <div className="report-tabs">
        {Object.keys(reports).map((key) => (
          <button
            key={key}
            className={selectedReport === key ? "active" : ""}
            onClick={() => setSelectedReport(key)}
          >
            {reports[key].title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Download Button */}
      <div className="download-section">
        <button onClick={downloadPDF} className="download-btn">
          📥 Download PDF
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading statistics...</p>
        </div>
      ) : (
        <div ref={reportRef} className="report-content">
          <div className="report-chart">
            {selectedReport === "attendance" && attendanceStats.total_days === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                margin: '20px 0'
              }}>
                <p style={{ fontSize: '18px', color: '#6c757d' }}>
                  📊 No attendance data available yet.
                </p>
                <p style={{ color: '#6c757d' }}>
                  Attendance statistics will appear here once teachers record attendance.
                </p>
              </div>
            ) : selectedReport === "mood" && moodStats.data.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '50px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                margin: '20px 0'
              }}>
                <p style={{ fontSize: '18px', color: '#6c757d' }}>
                  📊 No mood data available yet.
                </p>
                <p style={{ color: '#6c757d' }}>
                  Mood statistics will appear here once teachers record your child's moods.
                </p>
              </div>
            ) : (
              <>
                <Bar data={chartData} options={chartOptions} />
                {selectedReport === "attendance" && attendanceStats?.total_days > 0 && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Attendance Rate</h4>
                    <p style={{ 
                      fontSize: '36px', 
                      fontWeight: 'bold', 
                      margin: 0,
                      color: (Number(attendanceStats?.attendance_rate) || 0) >= 75 ? '#4caf50' : '#ff9800'
                    }}>
                      {Number(attendanceStats?.attendance_rate) || 0}%
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>
                      {Number(attendanceStats?.present) || 0} Present / {Number(attendanceStats?.total_days) || 0} Total Days
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="report-summary">
            <h3>{currentReport?.title || 'Statistics'} Summary</h3>
            <p>{currentReport?.summary || 'No summary available.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Digitalreport;
