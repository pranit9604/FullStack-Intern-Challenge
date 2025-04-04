import React from "react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const adminLinks = [
    { text: "Dashboard", path: "/admin-dashboard" },
    { text: "Manage Users", path: "/admin/users" },
    { text: "Manage Stores", path: "/admin/stores" },
  ];

  const userLinks = [
    { text: "Dashboard", path: "/user-dashboard" },
    { text: "View Stores", path: "/stores" },
  ];

  const storeOwnerLinks = [
    { text: "Dashboard", path: "/store-owner-dashboard" },
    { text: "My Store Ratings", path: "/store-owner/ratings" },
  ];

  const getLinks = () => {
    if (user?.role === "admin") return adminLinks;
    if (user?.role === "store_owner") return storeOwnerLinks;
    if (user?.role === "user") return userLinks;
    return [];
  };

  return (
    <Box sx={{ width: 250, p: 2, bgcolor: "background.paper", height: "100vh" }}>
      <Typography variant="h6" gutterBottom>
        {user?.role === "admin" && "Admin Panel"}
        {user?.role === "store_owner" && "Store Owner Panel"}
        {user?.role === "user" && "User Panel"}
      </Typography>
      <List>
        {getLinks().map((link) => (
          <ListItem button component={Link} to={link.path} key={link.text}>
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;