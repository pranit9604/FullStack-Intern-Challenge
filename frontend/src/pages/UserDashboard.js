import React, { useEffect, useState } from "react";
import { Typography, Container, TextField, Box, Alert, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import API from "../utils/api";
import RatingForm from "../components/RatingForm";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await API.get("/stores");
        setStores(response.data);
      } catch (err) {
        console.error("Error fetching stores:", err.response || err);
        setError("Error fetching stores");
      }
    };

    const fetchUserRatings = async () => {
      try {
        const response = await API.get("/ratings");
        const ratings = response.data.reduce((acc, rating) => {
          acc[rating.store._id] = rating.rating;
          return acc;
        }, {});
        setUserRatings(ratings);
      } catch (err) {
        console.error("Error fetching user ratings:", err.response || err);
        setError("Error fetching user ratings");
      }
    };

    fetchStores();
    fetchUserRatings();
  }, []);

  const handleRatingSubmit = async (email, rating) => {
    try {
      await API.post("/ratings", { email, rating });
      setUserRatings((prevRatings) => ({ ...prevRatings, [email]: rating }));
      alert("Rating submitted successfully!");
    } catch (err) {
      console.error("Error submitting rating:", err.response || err);
      setError(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        User Dashboard
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Search Stores by Name or Address"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Store Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Overall Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStores.map((store) => (
            <TableRow key={store._id}> {/* Ensure unique key */}
              <TableCell>{store.name}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.averageRating || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box>
        {filteredStores.map((store) => (
          <Box key={store._id} sx={{ mb: 4 }}> {/* Ensure unique key */}
            <Typography variant="h6">{store.name}</Typography>
            <Typography>{store.address}</Typography>
            <Typography>Overall Rating: {store.averageRating || "0.0"}</Typography>
            <RatingForm
              email={store.email}
              onRatingSubmit={(rating) => handleRatingSubmit(store.email, rating)}
            />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default UserDashboard;