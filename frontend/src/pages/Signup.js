import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateName, validateEmail, validatePassword, validateAddress } from "../utils/validation";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // Default role
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

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
    if (!validateEmail(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      setError(null); // Clear previous errors
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, formData);
      setSuccess(response.data.message || "Signup successful!");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
    } catch (err) {
      console.error("Signup error:", err.response || err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          boxShadow: 3,
          borderRadius: 2,
          mt: 4,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Sign Up
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            type="text"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            variant="outlined"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Address"
            name="address"
            variant="outlined"
            type="text"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            select
            label="Role"
            name="role"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="user">Normal User</MenuItem>
            <MenuItem value="store_owner">Store Owner</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;