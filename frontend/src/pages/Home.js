import React, { useEffect } from "react";
import { Typography, Button, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect logged-in users to their respective dashboards
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin-dashboard");
      if (user.role === "user") navigate("/user-dashboard");
      if (user.role === "store_owner") navigate("/store-owner-dashboard");
    }
  }, [user, navigate]);

  return (
    <Container>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Welcome to the Store Rating Platform
        <Typography>Made By Pranit Kakan</Typography>
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Rate stores you visit and see feedback from others.
      </Typography>
      {!user && (
        <>
          <Button
            variant="contained"
            color="primary"
            href="/signup"
            sx={{ display: "block", mx: "auto", mb: 2 }}
          >
            Sign Up Now
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href="/login"
            sx={{ display: "block", mx: "auto" }}
          >
            Log In
          </Button>
        </>
      )}
    </Container>
  );
};

export default Home;