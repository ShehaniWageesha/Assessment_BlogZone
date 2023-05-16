import React, { Component } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  LinearProgress,
  DialogTitle,
  DialogContent,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";
const axios = require("axios");

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      openBlogModal: false,
      openBlogEditModal: false,
      id: "",
      title: "",
      desc: "",
      file: "",
      fileName: "",
      page: 1,
      search: "",
      blogs: [],
      pages: 0,
      loading: false,
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      this.props.history.push("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getBlog();
      });
    }
  };

  getBlog = () => {
    this.setState({ loading: true });

    let data = "?";
    data = `${data}page=${this.state.page}`;
    if (this.state.search) {
      data = `${data}&search=${this.state.search}`;
    }
    axios
      .get(`http://localhost:2000/get-blog${data}`, {
        headers: {
          token: this.state.token,
        },
      })
      .then((res) => {
        this.setState({
          loading: false,
          blogs: res.data.blogs,
          pages: res.data.pages,
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.setState({ loading: false, blogs: [], pages: 0 }, () => {});
      });
  };

  deleteBlog = (id) => {
    axios
      .post(
        "http://localhost:2000/delete-blog",
        {
          id: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            token: this.state.token,
          },
        }
      )
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.setState({ page: 1 }, () => {
          this.pageChange(null, 1);
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  pageChange = (e, page) => {
    this.setState({ page: page }, () => {
      this.getBlog();
    });
  };

  logOut = () => {
    localStorage.setItem("token", null);
    this.props.history.push("/");
  };

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => {});
    }
    this.setState({ [e.target.name]: e.target.value }, () => {});
    if (e.target.name == "search") {
      this.setState({ page: 1 }, () => {
        this.getBlog();
      });
    }
  };

  addBlog = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append("file", fileInput.files[0]);
    file.append("title", this.state.title);
    file.append("desc", this.state.desc);

    axios
      .post("http://localhost:2000/add-blog", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleBlogClose();
        this.setState({ title: "", desc: "", file: null, page: 1 }, () => {
          this.getBlog();
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleBlogClose();
      });
  };

  updateBlog = () => {
    const fileInput = document.querySelector("#fileInput");
    const file = new FormData();
    file.append("id", this.state.id);
    file.append("file", fileInput.files[0]);
    file.append("title", this.state.title);
    file.append("desc", this.state.desc);

    axios
      .post("http://localhost:2000/update-blog", file, {
        headers: {
          "content-type": "multipart/form-data",
          token: this.state.token,
        },
      })
      .then((res) => {
        swal({
          text: res.data.title,
          icon: "success",
          type: "success",
        });

        this.handleBlogEditClose();
        this.setState({ title: "", desc: "", file: null }, () => {
          this.getBlog();
        });
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
        this.handleBlogEditClose();
      });
  };

  handleBlogOpen = () => {
    this.setState({
      openBlogModal: true,
      id: "",
      title: "",
      desc: "",
      fileName: "",
    });
  };

  handleBlogClose = () => {
    this.setState({ openBlogModal: false });
  };

  handleBlogEditOpen = (data) => {
    this.setState({
      openBlogEditModal: true,
      id: data._id,
      title: data.title,
      desc: data.desc,
      fileName: data.image,
    });
  };

  handleBlogEditClose = () => {
    this.setState({ openBlogEditModal: false });
  };

  render() {
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.handleBlogOpen}
          >
            Add Blog
          </Button>
          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>

        {/* Edit Blog  */}
        <Dialog
          open={this.state.openBlogEditModal}
          onClose={this.handleBlogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Edit Blog</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="Title"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Body"
              required
            />
            <br />
            <br />
            <br />
            <Button variant="contained" component="label">
              {" "}
              Upload
              <input
                // id="standard-basic"
                type="file"
                accept="image/*"
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="Image"
                hidden
              />
            </Button>
            &nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleBlogEditClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.title == "" || this.state.desc == ""}
              onClick={(e) => this.updateBlog()}
              color="primary"
              autoFocus
            >
              Edit Blog
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Blog */}
        <Dialog
          open={this.state.openBlogModal}
          onClose={this.handleBlogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Blog</DialogTitle>
          <DialogContent>
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              placeholder="Title"
              required
            />
            <br />
            <TextField
              id="standard-basic"
              type="text"
              autoComplete="off"
              name="desc"
              value={this.state.desc}
              onChange={this.onChange}
              placeholder="Body"
              required
            />
            <br />
            <br />
            <br />
            <Button variant="contained" component="label">
              {" "}
              Upload
              <input
                // id="standard-basic"
                type="file"
                accept="image/*"
                // inputProps={{
                //   accept: "image/*"
                // }}
                name="file"
                value={this.state.file}
                onChange={this.onChange}
                id="fileInput"
                placeholder="Image"
                hidden
              />
            </Button>
            &nbsp;
            {this.state.fileName}
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleBlogClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={
                this.state.title == "" ||
                this.state.desc == "" ||
                this.state.file == null
              }
              onClick={(e) => this.addBlog()}
              color="primary"
              autoFocus
            >
              Add Blog
            </Button>
          </DialogActions>
        </Dialog>

        <br />

        <TableContainer>
          <TextField
            id="standard-basic"
            type="search"
            autoComplete="off"
            name="search"
            value={this.state.search}
            onChange={this.onChange}
            placeholder="Search by blog name"
            required
          />
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Body</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.blogs.map((row) => (
                <TableRow key={row.title}>
                  <TableCell align="center" component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={`http://localhost:2000/${row.image}`}
                      width="70"
                      height="70"
                    />
                  </TableCell>
                  <TableCell align="center">{row.desc}</TableCell>
                  <TableCell align="center">
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={(e) => this.handleBlogEditOpen(row)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="button_style"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={(e) => this.deleteBlog(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          <Pagination
            count={this.state.pages}
            page={this.state.page}
            onChange={this.pageChange}
            color="primary"
          />
        </TableContainer>
      </div>
    );
  }
}
