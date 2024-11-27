import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import moment from "moment";

const Dashboard = () => {
  // State to handle loading indicator
  const [loading, setLoading] = useState(false);

  // Form data for title and description
  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    titleUpdatedAt: "",
    descriptionUpdatedAt: "",
  });

  // Store original data to track changes
  const [originalData, setOriginalData] = useState({
    title: "",
    description: "",
  });

  // Fetch the latest content data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true); // Show loader during the fetch
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data && data.length > 0) {
        // Update state with the latest data
        setForm({
          id: data[0].id,
          title: data[0].title,
          description: data[0].description,
          titleUpdatedAt: data[0].titleUpdatedAt,
          descriptionUpdatedAt: data[0].descriptionUpdatedAt,
        });
        setOriginalData({
          title: data[0].title,
          description: data[0].description,
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    } finally {
      setLoading(false); // Hide loader once fetch is complete
    }
  };

  // Update form state when user types in input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit updated data to Supabase
  const handleSubmit = async () => {
    try {
      setLoading(true); // Show loader during the update

      // Prepare the updates object with changes only
      const updates = { id: form.id };

      if (form.title !== originalData.title) {
        updates.title = form.title;
        updates.titleUpdatedAt = new Date();
      }

      if (form.description !== originalData.description) {
        updates.description = form.description;
        updates.descriptionUpdatedAt = new Date();
      }

      const { error } = await supabase
        .from("content")
        .update(updates)
        .eq("id", form.id);

      if (error) {
        console.error("Error updating data:", error.message);
        return;
      }

      // Refresh data after successful update
      await fetchData();
    } catch (err) {
      console.error("Unexpected error during update:", err.message);
    } finally {
      setLoading(false); // Hide loader once update is complete
    }
  };

  // Fetch data when the component loads
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box bgcolor="#161412" color="white" height="100vh">
      {/* Header Section */}
      <Box
        width="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="50px 0"
      >
        <Typography variant="h2">Admin Dashboard</Typography>
      </Box>

      {/* Form Section */}
      <Box
        width="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap={2}
      >
        {/* Title Input */}
        <TextField
          name="title"
          value={form.title}
          onChange={handleChange}
          label="Title"
          sx={{
            width: "25%",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
          }}
        />

        {/* Description Input */}
        <TextField
          name="description"
          value={form.description}
          onChange={handleChange}
          label="Description"
          multiline
          rows={4}
          sx={{
            mt: 5,
            width: "25%",
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
            },
          }}
        />

        {/* Last Updated Info */}
        <Box width="25%">
          <Typography style={{ margin: "20px 0", fontSize: "13px" }}>
            Title Last Updated:{" "}
            <b>{moment(form.titleUpdatedAt).format("DD-MM-YYYY hh:mma")}</b>
          </Typography>
          <Typography style={{ margin: "20px 0", fontSize: "13px" }}>
            Description Last Updated:{" "}
            <b>
              {moment(form.descriptionUpdatedAt).format("DD-MM-YYYY hh:mma")}
            </b>
          </Typography>
        </Box>

        {/* Update Button */}
        <Button
          disabled={loading}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "white",
            width: "25%",
            color: "black",
            fontWeight: "bold",
          }}
        >
          {loading ? (
            <CircularProgress size="25px" sx={{ color: "grey.500" }} />
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
