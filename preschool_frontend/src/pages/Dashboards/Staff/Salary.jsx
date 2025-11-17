import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../Context/AppProvider";
import axios from "axios";
import jsPDF from "jspdf";
import "./Salary.css";

export default function Salary(){

    const {user} = useContext(AppContext);
    const [salaries, setSalaries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSalary();
    }, []);

    async function getSalary(){
        try {
            setLoading(true);
            const res = await axios.get(`/api/teacher/salary/${user.id}`);
            setSalaries(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch salary data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const downloadPDF = (salary) => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Salary Report", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Employee ID: ${salary.user_id}`, 20, 40);
        doc.text(`Salary Date: ${new Date(salary.salary_date).toLocaleDateString()}`, 20, 50);
        doc.text(`Basic Salary: $${parseFloat(salary.basic_salary).toFixed(2)}`, 20, 60);
        doc.text(`Overtime: $${parseFloat(salary.over_time).toFixed(2)}`, 20, 70);
        doc.text(`Fuel Allowance: $${parseFloat(salary.fuel_allowence).toFixed(2)}`, 20, 80);
        doc.text(`Net Salary: $${parseFloat(salary.net_sallary).toFixed(2)}`, 20, 90);
        
        doc.save(`salary_report_${salary.salary_date}.pdf`);
    };

    return(
        <div className="salary-container-unique">
            <h1 className="salary-title-unique">My Salary Records</h1>
            
            {loading && <p className="salary-loading-unique">Loading...</p>}
            {error && <p className="salary-error-unique">{error}</p>}
            
            <div className="salary-cards-grid-unique">
                {salaries.map((salary, index) => (
                    <div key={index} className="salary-card-unique">
                        <div className="salary-card-header-unique">
                            <h3>Salary Statement</h3>
                            <span className="salary-date-unique">
                                {new Date(salary.salary_date).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="salary-card-body-unique">
                            <div className="salary-item-unique">
                                <span className="salary-label-unique">Employee ID:</span>
                                <span className="salary-value-unique">{salary.user_id}</span>
                            </div>
                            
                            <div className="salary-item-unique">
                                <span className="salary-label-unique">Basic Salary:</span>
                                <span className="salary-value-unique">Rs{parseFloat(salary.basic_salary).toFixed(2)}</span>
                            </div>
                            
                            <div className="salary-item-unique">
                                <span className="salary-label-unique">Overtime:</span>
                                <span className="salary-value-unique">Rs{parseFloat(salary.over_time).toFixed(2)}</span>
                            </div>
                            
                            <div className="salary-item-unique">
                                <span className="salary-label-unique">Fuel Allowance:</span>
                                <span className="salary-value-unique">Rs{parseFloat(salary.fuel_allowence).toFixed(2)}</span>
                            </div>
                            
                            <div className="salary-item-unique salary-total-unique">
                                <span className="salary-label-unique">Net Salary:</span>
                                <span className="salary-value-unique">Rs{parseFloat(salary.net_sallary).toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <button 
                            className="salary-download-btn-unique"
                            onClick={() => downloadPDF(salary)}
                        >
                            Download PDF Report
                        </button>
                    </div>
                ))}
            </div>
            
            {!loading && salaries.length === 0 && (
                <p className="salary-empty-unique">No salary records found.</p>
            )}
        </div>
    );
}