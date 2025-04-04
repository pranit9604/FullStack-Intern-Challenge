import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  MenuItem,
  Paper,
  Grid,
  TableContainer,
} from "@mui/material";
import API from "../utils/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [newStore, setNewStore] = useState({ name: "", email: "", address: "", owner: "" });
  const [storeOwners, setStoreOwners] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
    fetchStoreOwners();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/admin/dashboard-stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error.response || error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response || error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await API.get("/admin/stores");
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error.response || error);
    }
  };

  const fetchStoreOwners = async () => {
    try {
      const response = await API.get("/admin/store-owners");
      console.log("Store Owners API Response:", response.data); // Debugging log

      if (response.data && Array.isArray(response.data)) {
        setStoreOwners(response.data); // Ensure storeOwners is populated with valid data
      } else {
        console.error("Invalid data format for store owners:", response.data);
        setStoreOwners([]); // Reset storeOwners to an empty array if data is invalid
      }
    } catch (error) {
      console.error("Error fetching store owners:", error.response || error);
      alert("Failed to fetch store owners. Please try again later.");
      setStoreOwners([]); // Reset storeOwners to an empty array on error
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
    console.log("Updated newStore object:", { ...newStore, [e.target.name]: e.target.value }); // Debugging log
  };

  const applyFilters = async () => {
    try {
      const response = await API.get("/admin/users", { params: filters });
      setUsers(response.data);
    } catch (error) {
      console.error("Error applying filters:", error.response || error);
    }
  };

  const addUser = async () => {
    try {
      console.log("Adding user with data:", newUser);

      if (!newUser.name || !newUser.email || !newUser.password || !newUser.address || !newUser.role) {
        alert("Please fill in all fields before adding a user.");
        return;
      }

      await API.post("/admin/users", newUser);
      fetchUsers();
      alert("User added successfully!");
    } catch (error) {
      console.error("Error adding user:", error.response || error);
      alert(error.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  const addStore = async () => {
    try {
      console.log("Adding store with data:", newStore); // Debugging log

      // Validate required fields
      if (!newStore.name || !newStore.email || !newStore.address || !newStore.owner) {
        console.log("Validation failed. Current newStore object:", newStore); // Debugging log
        alert("Please fill in all fields before adding a store.");
        return;
      }

      // Ensure the owner field is correctly set
      if (!storeOwners.some((owner) => owner._id === newStore.owner)) {
        alert("Invalid owner selected. Please select a valid owner.");
        return;
      }

      // Make API call to add the store
      const response = await API.post("/admin/stores", newStore);
      console.log("Store added successfully:", response.data); // Debugging log

      // Refresh the stores list
      fetchStores();

      // Reset the form
      setNewStore({ name: "", email: "", address: "", owner: "" });
      alert("Store added successfully!");
    } catch (error) {
      console.error("Error adding store:", error.response || error);
      alert(error.response?.data?.message || "Failed to add store. Please try again.");
    }
  };

  const logout = () => {
    try {
      API.post("/auth/logout"); // Replace with your logout API endpoint
      alert("Logged out successfully!");
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error.response || error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button onClick={logout} variant="contained" color="secondary">
          Logout
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Statistics Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h5">{stats.totalUsers}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Stores</Typography>
            <Typography variant="h5">{stats.totalStores}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Total Ratings</Typography>
            <Typography variant="h5">{stats.totalRatings}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Section */}
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Name" name="name" onChange={handleFilterChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Email" name="email" onChange={handleFilterChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Address" name="address" onChange={handleFilterChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField label="Role" name="role" onChange={handleFilterChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={applyFilters} variant="contained" fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add New User Section */}
      <Typography variant="h5" gutterBottom>
        Add New User
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" onChange={handleUserChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" onChange={handleUserChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Password" name="password" onChange={handleUserChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Address" name="address" onChange={handleUserChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Role"
              name="role"
              value={newUser.role}
              onChange={handleUserChange}
              fullWidth
            >
              <MenuItem value="user">Normal User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addUser} variant="contained" fullWidth>
              Add User
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stores Section */}
      <Typography variant="h5" gutterBottom>
        Stores
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store._id}>
                  <TableCell>{store.name}</TableCell>
                  <TableCell>{store.email}</TableCell>
                  <TableCell>{store.address}</TableCell>
                  <TableCell>{store.averageRating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add New Store Section */}
      <Typography variant="h5" gutterBottom>
        Add New Store
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="Name"
              name="name"
              onChange={handleStoreChange}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Email"
              name="email"
              onChange={handleStoreChange}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Address"
              name="address"
              onChange={handleStoreChange}
              fullWidth
              variant="outlined"
              sx={{ backgroundColor: "#f9f9f9" }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Owner"
              name="owner"
              value={newStore.owner}
              onChange={handleStoreChange}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true, // Ensure the label is always visible
              }}
              sx={{
                backgroundColor: "#f9f9f9",
                "& .MuiOutlinedInput-root": {
                  height: "56px",
                },
              }}
            >
              {storeOwners.length > 0 ? (
                storeOwners.map((owner) => (
                  <MenuItem key={owner._id} value={owner._id}>
                    {owner.email} {/* Display email instead of name */}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No owners available</MenuItem> // Handle empty dropdown
              )}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                onClick={addStore}
                variant="contained"
                color="primary"
                sx={{
                  minWidth: "150px",
                  fontWeight: "bold",
                }}
              >
                Add Store
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;