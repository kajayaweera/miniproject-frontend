import React, { useState, useRef } from "react";
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
import "../../../css/Digitalreport.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

const Digitalreport = () => {
  const [selectedReport, setSelectedReport] = useState("academic");
  const reportRef = useRef(null);

  const reports = {
    academic: {
      title: "Academic Progress",
      labels: ["Math", "Reading", "Writing", "Science"],
      data: [88, 92, 85, 90],
      color: "rgba(75, 192, 192, 0.7)",
      summary:
        "Your child shows excellent academic progress, performing strongly in reading and science. Continuous improvement in writing and math is noted.",
    },
    behavior: {
      title: "Behavior Progress",
      labels: ["Sharing", "Listening", "Helping", "Respect"],
      data: [95, 88, 92, 97],
      color: "rgba(255, 159, 64, 0.7)",
      summary:
        "Great behavior! Your child consistently demonstrates respect and helpfulness. Keep encouraging teamwork and active listening.",
    },
    mood: {
      title: "Mood Progress",
      labels: ["Happy", "Calm", "Active", "Upset"],
      data: [70, 20, 8, 2],
      color: "rgba(153, 102, 255, 0.7)",
      summary:
        "Mostly positive moods observed. Happy and calm behaviors dominate, with minimal signs of stress or upset moments.",
    },
  };

  const currentReport = reports[selectedReport];

  const chartData = {
    labels: currentReport.labels,
    datasets: [
      {
        label: currentReport.title,
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
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`${currentReport.title}_Report.pdf`);
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

      <div ref={reportRef} className="report-content">
        <div className="report-chart">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="report-summary">
          <h3>{currentReport.title} Summary</h3>
          <p>{currentReport.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default Digitalreport;
