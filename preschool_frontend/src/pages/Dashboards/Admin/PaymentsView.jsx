import axios from "axios";
import { useEffect, useState } from "react";
import './PaymentsView.css';

export default function PaymentsView(){

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getPayments(){
        try {
            setLoading(true);
            const res = await axios.get('/api/payments');
            setPayments(res.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        getPayments();
    },[])

    const parseCourses = (coursesData) => {
        try {
            return typeof coursesData === 'string' ? JSON.parse(coursesData) : coursesData;
        } catch (error) {
            console.error("Error parsing courses:", error);
            return [];
        }
    };

    if (loading) {
        return <div className="payments-loading">Loading payments...</div>;
    }

    return(
        <div className="payments-container">
            <div className="payments-header">
                <h1>Payment Management</h1>
                <p>Total Payments: {payments.length}</p>
            </div>

            <div className="payments-table-wrapper">
                <table className="payments-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>Courses</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td className="user-name">{payment.user?.name || 'N/A'}</td>
                                    <td className="courses-cell">
                                        <div className="courses-list">
                                            {parseCourses(payment.courses).map((course, index) => (
                                                <div key={index} className="course-item">
                                                    <span className="course-name">{course.course_name}</span>
                                                    <span className="course-amount">Rs.{parseFloat(course.amount).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="total-amount">Rs.{parseFloat(payment.total_amount).toFixed(2)}</td>
                                    <td className="payment-date">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-payments">No payments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}