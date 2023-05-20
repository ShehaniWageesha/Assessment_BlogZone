import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, TextField, Typography, Button } from "@mui/material";

function BlogDetail() {
  const navigate = useNavigate();
  const [blog, setBlog] = useState();
  const id = useParams().id;

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    setInputs((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  const fetchDetails = async () => {
    const res = await axios
      .get(`http://localhost:8000/api/blog/${id}`)
      .catch((err) => console.log(err));

    const data = res.data;
    return data;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendRequest()
      .then((data) => console.log(data))  
      .then(() => navigate("/myBlogs"));
  };

  useEffect(() => {
    fetchDetails().then((data) => {
      setBlog(data);
      setInputs({
        title: data.blog.title,
        content: data.blog.content,
        image: data.blog.image,
      });
    });
  }, [id]);

  const sendRequest = async () => {
    const res = await axios
      .put(`http://localhost:8000/api/blog/update/${id}`, {
        title: inputs.title,
        content: inputs.content,
        image: inputs.image,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  return (
    <div>
      {inputs && (
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
              padding={3}
              fontWeight="bolder"
              color="gray"
              variant="h4"
              textAlign={"left"}
            >
              Update your blog...
            </Typography>
            <TextField
              id="outlined-uncontrolled"
              label="Title"
              name="title"
              onChange={handleChange}
              value={inputs.title}
              margin="normal"
              focused
            />
            <TextField
              id="outlined-uncontrolled"
              label="Body"
              name="content"
              onChange={handleChange}
              value={inputs.content}
              margin="normal"
              multiline
              focused
            />
            <TextField
              id="outlined-uncontrolled"
              label="Image URL"
              name="image"
              onChange={handleChange}
              value={inputs.image}
              margin="normal"
              focused
            />
            <br/><br/>
            <Button
              sx={{ mt: 2, borderRadius: 4, width: '150px', float: 'right' }}
              variant="contained"
              color="info"
              type="submit"
            >
              Update
            </Button> 
            <br/>
          </Box>
        </form>
      )}
    </div>
  );
}

export default BlogDetail;
