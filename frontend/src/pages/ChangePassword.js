import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null); // Clear previous errors
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

      const response = await axios.put(
        `${apiBaseUrl}/auth/change-password`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message || "Password changed successfully!");
      setFormData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err.response || err);
      setError(err.response?.data?.message || "Failed to change password. Please try again.");
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
          Change Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Old Password"
            name="oldPassword"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
          <TextField
            label="New Password"
            name="newPassword"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
