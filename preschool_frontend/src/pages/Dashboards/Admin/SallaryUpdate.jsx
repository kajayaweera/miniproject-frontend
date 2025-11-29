import { useEffect, useState } from "react"
import axios from "axios"
import "./SallaryUpdate.css"

export default function SallaryUpdate() {

    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        user_id: '',
        salary_date: '',
        basic_salary: '',
        over_time: '',
        fuel_allowence: '',
        net_sallary: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    async function getTeachers() {
        try {
            const res = await axios.get('/api/get/teachers/')
            setTeachers(res.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Salary Validations
        if (name === "basic_salary" && (value < 0 || value > 50000)) {
            setMessage("🛑 Please enter correct salary. Basic salary must be between 0 and 5000.");
        } 
        else if (name === "over_time" && (value < 0 || value > 50000)) {
            setMessage("🛑 Please enter correct salary. Overtime must be between 0 and 5000.");
        } 
        else if (name === "fuel_allowence" && (value < 0 || value > 20000)) {
            setMessage("🛑 Please enter correct salary. Fuel allowance must be between 0 and 2000.");
        } 
        else {
            setMessage("");  // Clear message when valid
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const calculateNetSalary = () => {
        const basic = parseFloat(formData.basic_salary) || 0;
        const overtime = parseFloat(formData.over_time) || 0;
        const fuel = parseFloat(formData.fuel_allowence) || 0;
        return (basic + overtime + fuel).toFixed(2);
    };

    async function submitData(e) {
        e.preventDefault();
        setMessage('');

        // Prevent submit if invalid
        if (
            formData.basic_salary < 0 || formData.basic_salary > 50000 ||
            formData.over_time < 0 || formData.over_time > 50000 ||
            formData.fuel_allowence < 0 || formData.fuel_allowence > 20000
        ) {
            setMessage("🛑Please enter correct salary.");
            return;
        }

        setLoading(true);

        const dataToSubmit = {
            ...formData,
            net_sallary: calculateNetSalary()
        };

        try {
            const res = await axios.post('/api/salaries', dataToSubmit);
            setMessage('Salary submitted successfully!');
            setFormData({
                user_id: '',
                salary_date: '',
                basic_salary: '',
                over_time: '',
                fuel_allowence: '',
                net_sallary: ''
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error submitting salary');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTeachers();
    }, []);

    return (
        <div className="salary-update-container">
            <h2>💸 Update Teacher Salary</h2>

            <form onSubmit={submitData} className="salary-form">

                <div className="form-group">
                    <label htmlFor="user_id">Select Teacher</label>
                    <select
                        id="user_id"
                        name="user_id"
                        value={formData.user_id}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">-- Select Teacher --</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="salary_date">Salary Date</label>
                    <input
                        type="date"
                        id="salary_date"
                        name="salary_date"
                        value={formData.salary_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* BASIC SALARY */}
                <div className="form-group">
                    <label htmlFor="basic_salary">Basic Salary (0 - 50000)</label>
                    <input
                        type="number"
                        id="basic_salary"
                        name="basic_salary"
                        value={formData.basic_salary}
                        onChange={handleInputChange}
                        min="0"
                        max="50000"
                        step="0.01"
                        required
                    />
                </div>

                {/* OVERTIME */}
                <div className="form-group">
                    <label htmlFor="over_time">Over Time Salary (0 - 50000)</label>
                    <input
                        type="number"
                        id="over_time"
                        name="over_time"
                        value={formData.over_time}
                        onChange={handleInputChange}
                        min="0"
                        max="50000"
                        step="0.01"
                        required
                    />
                </div>

                {/* FUEL */}
                <div className="form-group">
                    <label htmlFor="fuel_allowence">Fuel Allowance (0 - 20000)</label>
                    <input
                        type="number"
                        id="fuel_allowence"
                        name="fuel_allowence"
                        value={formData.fuel_allowence}
                        onChange={handleInputChange}
                        min="0"
                        max="20000"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group net-salary">
                    <label>Net Salary</label>
                    <div className="calculated-salary">
                        Rs. {calculateNetSalary()}
                    </div>
                </div>

                {message && (
                    <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                )}

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Salary'}
                </button>
            </form>
        </div>
    );
}
