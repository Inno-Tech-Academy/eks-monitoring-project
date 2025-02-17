import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Import the CSS file

// Ensure the API URL is set correctly
const API_URL = process.env.REACT_APP_API_URL; 
console.log("📢 API URL in frontend:", API_URL);

const Register = ({ setToken }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log("📢 Attempting to register user:", formData);

      // Register the user
      const response = await axios.post("http://backend.default.svc.cluster.local:5000/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log(" API_URL: ", API_URL);
      console.log("✅ Registration response:", response);
      if (response.status === 201 && response.data?.message) {
        setMessage(response.data.message);
      } else {
        setMessage("Registration completed, but no message received.");
      }

      // Proceed with login after successful registration
      try {
        console.log("📢 Attempting login for:", formData.email);

        const loginResponse = await axios.post("http://backend.default.svc.cluster.local:5000/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log("✅ Login response:", loginResponse);

        if (loginResponse.data?.token) {
          setToken(loginResponse.data.token);
          setMessage("Registration and login successful!");
        } else {
          setMessage("Login failed: No token received.");
        }
      } catch (loginError) {
        console.error("❌ Error during login:", loginError);
        setMessage(loginError.response?.data?.message || "Registration succeeded, but login failed.");
      }
    } catch (error) {
      console.error("❌ Registration Error:", error);
      setMessage(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default Register;
