import '../css/Registration.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Registration() {
    const location = useLocation();
    const navigate = useNavigate();
    const role = location.state?.role || '';
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Form Data Submitted:", formData);
        alert("Registration Successful!");

        // Redirect to the appropriate dashboard after successful registration
        if (role === 'admin') {
            navigate('/admin/dashboard');
        } else if (role === 'staff') {
            navigate('/staff/dashboard');
        } else if (role === 'parent') {
            navigate('/parent/dashboard');
        }
    };

    return (
        <div className='regbody'>
            <div className='topic'>
                <h2>REGISTRATION</h2>
            </div>

            <form className="reg_form" onSubmit={handleSubmit}>
                {role === 'admin' && (
                    <div className='form-group'>
                        <label>Admin ID</label>
                        <input type="text" name="adminId" onChange={handleChange} required />
                    </div>
                )}

                {role === 'staff' && (
                    <div className='form-group'>
                        <label>Staff Number</label>
                        <input type="text" name="staffNumber" onChange={handleChange} required />
                        <label>Position</label>
                        <input type="text" name="position" onChange={handleChange} />
                    </div>
                )}

                {role === 'parent' && (
                    <>
                        <div className='form-group name'>
                            <label>Child Name</label>
                            <input type="text" name="childFirst" placeholder="First name" onChange={handleChange} />
                            <input type="text" name="childLast" placeholder="Last name" onChange={handleChange} />
                        </div>

                        <div className='form-group'>
                            <label>Age</label>
                            <input type="text" name="childAge" onChange={handleChange} />
                        </div>

                        <div className='form-group name'>
                            <label>Parent/Guardian Name</label>
                            <input type="text" name="parentFirst" placeholder="First name" onChange={handleChange} />
                            <input type="text" name="parentLast" placeholder="Last name" onChange={handleChange} />
                        </div>
                    </>
                )}

                {/* Common Fields */}
                <div className='form-group'>
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>

                <div className='form-group'>
                    <label>Address</label>
                    <input type="text" name="address" onChange={handleChange} />
                </div>

                <div className='form-group'>
                    <label>Contact Number</label>
                    <input type="text" name="contact" onChange={handleChange} />
                </div>

                <div className='form-group'>
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>

                <div className='form-group'>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" onChange={handleChange} required />
                </div>

                <div className='reg_btn'>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}

export default Registration;
