import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import "./Register.css"; 

export default function Register() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    address: "",
    contact_number: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});

  async function handleRegister(e) {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.errors) {
      setErrors(data.errors);
    } else {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      switch (data.user.role) {
          case "teacher":
            navigate("/staff/dashboard");
            break;
          case "parent":
            navigate("/parent/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
    }
  }

  return (
    <div className="register-container">
      <h1 className="register-title">Create Your Account</h1>

      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((f) => ({ ...f, name: e.target.value }))
            }
          />
          {errors.name && <p className="error">{errors.name[0]}</p>}
        </div>

        <div className="form-group">
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((f) => ({ ...f, role: e.target.value }))
            }
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="error">{errors.role[0]}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((f) => ({ ...f, email: e.target.value }))
            }
          />
          {errors.email && <p className="error">{errors.email[0]}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData((f) => ({ ...f, address: e.target.value }))
            }
          />
          {errors.address && <p className="error">{errors.address[0]}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            placeholder="Contact Number"
            value={formData.contact_number}
            onChange={(e) =>
              setFormData((f) => ({ ...f, contact_number: e.target.value }))
            }
          />
          {errors.contact_number && (
            <p className="error">{errors.contact_number[0]}</p>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData((f) => ({ ...f, password: e.target.value }))
            }
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.password_confirmation}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                password_confirmation: e.target.value,
              }))
            }
          />
        </div>

        <button className="register-btn">Register</button>
      </form>
    </div>
  );
}
