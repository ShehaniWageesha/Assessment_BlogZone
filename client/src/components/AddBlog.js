import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Typography, Button } from "@mui/material";

const AddBlog = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    image: "",
  });

  const handleChange = (event) => {
    setInputs((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const sendRequest = async (type = "signin") => {
    const res = await axios
      .post("http://localhost:8000/api/blog/add", {
        title: inputs.title,
        content: inputs.content,
        image: inputs.image,
        user: localStorage.getItem("userId"),
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendRequest()
      .then((data) => console.log(data))
      .then(() => navigate("/"));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          boxShadow="10px 10px 20px #ccc"
          padding={3}
          margin={"auto"}
          marginTop={5}
          display="flex"
          flexDirection={"column"}
          width={"70%"}
        >
          <Typography
            color="gray"
            variant="h4"
            textAlign={"left"}
          >
            Create your blog...
          </Typography>
          <br/><br/>
          <TextField
            label="Title"
            name="title"
            onChange={handleChange}
            value={inputs.title}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Body"
            name="content"
            onChange={handleChange}
            value={inputs.content}
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Image URL"
            name="image"
            onChange={handleChange}
            value={inputs.image}
            margin="normal"
            variant="outlined"
          />
          <br />
          <Button
            sx={{ mt: 2, borderRadius: 3, width: '150px' }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit
          </Button>
          <br />
        </Box>
      </form>
    </div>
  );
};

export default AddBlog;
