import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";

function Header() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const [value, setValue] = useState();
  return (
    <AppBar expand="lg" position="sticky">
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          variant="h4"
          style={{ textDecoration: "none", color: "#ffffff" }}
        >
          | BlogZone |
        </Typography>
        {isLoggedIn && (
          <Box display="flex">
            <Tabs value={value} onChange={(event, val) => setValue(val)}>
              <Tab
                style={{ color: "#ffffff" }}
                LinkComponent={Link}
                to="/"
                label="All Blogs"
              />
              <Tab
                style={{ color: "#ffffff" }}
                LinkComponent={Link}
                to="/myBlogs"
                label="My Blogs"
              />
              <Tab
                style={{ color: "#ffffff" }}
                LinkComponent={Link}
                to="/blogs/add"
                label="Create Blogs"
              />
            </Tabs>
          </Box>
        )}
        <Box display="flex" marginLeft="auto">
          {!isLoggedIn && (
            <>
              <Button
                LinkComponent={Link}
                to="/auth"
                variant="contained"
                sx={{
                  margin: 1,
                  borderRadius: 10,
                  bgcolor: "#ffffff",
                  color: "gray",
                }}
              >
                Login
              </Button>
              <Button
                LinkComponent={Link}
                to="/auth"
                variant="contained"
                sx={{
                  margin: 1,
                  borderRadius: 10,
                  bgcolor: "#ffffff",
                  color: "gray",
                }}
              >
                Register
              </Button>
            </>
          )}
          {isLoggedIn && (
            <Button
              onClick={() => dispatch(authActions.logout())}
              LinkComponent={Link}
              to="/"
              variant="contained"
              sx={{
                margin: 1,
                borderRadius: 10,
                bgcolor: "#ffffff",
                color: "gray",
              }}
            >
              Log Out
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
