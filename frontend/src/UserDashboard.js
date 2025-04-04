// ...existing code...
useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await API.get("/stores"); // Ensure the endpoint is correct
      setStores(response.data);
    } catch (err) {
      console.error("Error fetching stores:", err.response || err);
      setError("Error fetching stores");
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await API.get("/ratings"); // Ensure the endpoint is correct
      const ratings = response.data.reduce((acc, rating) => {
        acc[rating.store._id] = rating.rating;
        return acc;
      }, {});
      setUserRatings(ratings);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No ratings found for this user.");
      } else {
        console.error("Error fetching user ratings:", err.response || err);
        setError(err.response?.data?.message || "Error fetching user ratings");
      }
    }
  };

  fetchStores();
  fetchUserRatings();
}, []);
// ...existing code...