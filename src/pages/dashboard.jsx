import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import moment from "moment";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    titleUpdatedAt: "",
    descriptionUpdatedAt: "",
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    description: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
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

      await fetchData();
    } catch (err) {
      console.error("Unexpected error during update:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      bgcolor="#161412"
      color="white"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      padding="20px"
    >
      {/* Header Section */}
      <Box
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="20px 0"
      >
        <Typography variant={isMobile ? "h4" : "h2"}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        width={isMobile ? "90%" : "25vw"}
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
          fullWidth
          sx={{
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
          rows={isMobile ? 4 : 8}
          fullWidth
          sx={{
            mt: 2,
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
        <Box width="100%">
          <Typography
            style={{ margin: "10px 0", fontSize: isMobile ? "12px" : "13px" }}
          >
            Title Last Updated:{" "}
            <b>{moment(form.titleUpdatedAt).format("DD-MM-YYYY hh:mma")}</b>
          </Typography>
          <Typography
            style={{ margin: "10px 0", fontSize: isMobile ? "12px" : "13px" }}
          >
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
          fullWidth
          sx={{
            backgroundColor: "white",
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
