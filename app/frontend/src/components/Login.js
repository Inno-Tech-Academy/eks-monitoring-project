import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Import the CSS file

const API_URL = process.env.REACT_APP_API_URL;

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${API_URL}/auth/login`, formData);
        console.log("✅ Login response:", response);

        if (response.data?.token) {
            setToken(response.data.token);
            setMessage("Login successful!");
        } else {
            setMessage("Login failed: No token received.");
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        console.error("❌ Login Error Response:", error.response?.data);
        setMessage(error.response?.data?.message || "Login failed!");
    }
};


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">something cool</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default Login;
