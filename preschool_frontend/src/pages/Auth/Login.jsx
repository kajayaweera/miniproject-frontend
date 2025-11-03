import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../../Context/AppProvider";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useContext(AppContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clear errors when user starts typing
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = ["Email is required"];
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"];
    }
    
    if (!formData.password.trim()) {
      newErrors.password = ["Password is required"];
    } else if (formData.password.length < 6) {
      newErrors.password = ["Password must be at least 6 characters"];
    }
    
    return newErrors;
  };

  async function handleLogin(e) {
    e.preventDefault();
    
    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.errors) {
        setErrors(data.errors);
      } else if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

        // Role-based navigation
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
      } else {
        setErrors({ general: ["Login failed. Please try again."] });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: ["Network error. Please check your connection and try again."] });
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon">
            🎓
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your preschool account</p>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            {errors.general[0]}
          </div>
        )}

        {/* Login Form */}
        <form className="login-form" onSubmit={handleLogin} noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`form-input ${errors.email ? "error" : ""}`}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>
            {errors.email && (
              <p className="error-message">
                <span className="error-icon">❌</span>
                {errors.email[0]}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`form-input ${errors.password ? "error" : ""}`}
                disabled={isLoading}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">
                <span className="error-icon">❌</span>
                {errors.password[0]}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`login-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-link">
            Forgot your password?
          </Link>
          
          <div className="signup-prompt">
            <span>Don't have an account? </span>
            <Link to="/register" className="signup-link">
              Sign up here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}