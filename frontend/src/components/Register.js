import React, { useState } from "react";
import { TextField, Button, MenuItem, Typography, Box, Alert } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // Default role
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.name.length < 20 || formData.name.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }
    if (formData.address.length > 400) {
      setError("Address must not exceed 400 characters.");
      return;
    }
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/.test(formData.password)) {
      setError("Password must be 8-16 characters long, include at least one uppercase letter and one special character.");
      return;
    }
    setError(null);

    try {
      console.log("Sending data to backend:", formData); // Debugging log

      // Use the API base URL from the environment variable or fallback to a default
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      console.log("API Base URL:", apiBaseUrl); // Debugging log

      const response = await axios.post(`${apiBaseUrl}/auth/register`, formData);
      setSuccess(response.data.message || "Registration successful!");
      console.log("Registration successful:", response.data); // Debugging log

      // Reset the form
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (error) {
      console.error("Registration error:", error.response || error); // Debugging log
      setError(error.response?.data?.message || "Error registering user");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your address"
          margin="normal"
          required
        />
        <TextField
          fullWidth
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          margin="normal"
          required
        >
          <MenuItem value="user">Normal User</MenuItem>
          <MenuItem value="store_owner">Store Owner</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
};

export default Register;