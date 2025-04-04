import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Table, TableHead, TableRow, TableCell, TableBody, Button, Alert, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const navigate = useNavigate();

  // Fetch store details and ratings
  const fetchStoreDetails = async () => {
    try {
      const response = await API.get("/stores/my-store"); // Ensure the correct endpoint is used
      setStore(response.data.store);
      setRatings(response.data.ratings);
    } catch (error) {
      console.error("Error fetching store details:", error.response || error);
      setError(error.response?.data?.message || "Failed to fetch store details.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle password change
  const handlePasswordChange = async () => {
    try {
      setPasswordError(null);
      setPasswordSuccess(null);
      const response = await API.put("/auth/change-password", passwords);
      setPasswordSuccess(response.data.message || "Password updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
      setPasswordDialogOpen(false);
    } catch (error) {
      console.error("Error updating password:", error.response || error);
      setPasswordError(error.response?.data?.message || "Failed to update password.");
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Store Owner Dashboard
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {store ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Store Details</Typography>
          <Typography>Name: {store.name}</Typography>
          <Typography>Email: {store.email}</Typography>
          <Typography>Address: {store.address}</Typography>
          <Typography>Average Rating: {store.averageRating || "N/A"}</Typography>
        </Box>
      ) : (
        !error && <Typography>No store found. Please create a store.</Typography>
      )}
      <Typography variant="h5" gutterBottom>
        Ratings
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ratings.map((rating) => (
            <TableRow key={rating._id}>
              <TableCell>{rating.user.name}</TableCell>
              <TableCell>{rating.rating}</TableCell>
              <TableCell>{new Date(rating.createdAt).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <Button onClick={() => setPasswordDialogOpen(true)} variant="contained" color="primary">
          Change Password
        </Button>
        <Button onClick={handleLogout} variant="contained" color="error">
          Log Out
        </Button>
      </Box>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
          {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StoreOwnerDashboard;