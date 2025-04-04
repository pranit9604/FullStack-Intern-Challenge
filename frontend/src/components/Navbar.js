import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Container sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" component="div">
            Store Rating Platform
          </Typography>
          <div>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {!user && (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Signup</Button>
              </>
            )}
            {user && user.role === "admin" && (
              <Button color="inherit" component={Link} to="/admin-dashboard">Admin Dashboard</Button>
            )}
            {user && user.role === "user" && (
              <Button color="inherit" component={Link} to="/user-dashboard">User Dashboard</Button>
            )}
            {user && user.role === "store_owner" && (
              <Button color="inherit" component={Link} to="/store-owner-dashboard">Store Owner Dashboard</Button>
            )}
            {user && (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            )}
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;