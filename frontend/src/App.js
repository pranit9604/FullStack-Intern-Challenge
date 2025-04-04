import React from "react";
import { Container, CssBaseline } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      {/* Global CSS Reset */}
      <CssBaseline />
      
      {/* Navbar for navigation */}
      <Navbar />
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <AppRoutes /> {/* This already handles routing, no need to duplicate */}
      </Container>
    </>
  );
};

export default App;