import React from "react";
import "./App.css";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet } from "react-router-dom";
import { teal } from "@mui/material/colors";
import { ThemeContext, FilterContext } from "./components/ThemeProviderWrapper";
import { useContext } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

function App() {
  const [darkMode, toggleDarkMode] = useContext(ThemeContext);
  const [filterShow, toggleFilterShow] = useContext(FilterContext);
  // All pages of application + routes
  const pages = [
    { label: "Locations", route: "/locations" },
    { label: "Routes", route: "/routes" },
  ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box className="App">
      {/* Navbar */}
      <AppBar
        position="static"
        sx={{ color: teal[50], backgroundColor: teal[900] }}
      >
        <Container maxWidth={false}>
          <Toolbar>
            <Typography
              variant="h4"
              noWrap
              component={Link}
              to="/"
              color="inherit"
              sx={{
                mr: 2,
                textDecoration: "none",
                display: { xs: "none", md: "flex" },
              }}
            >
              RISCs
            </Typography>

            {/* Navigation Menu for Mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.label}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={page.route}
                  >
                    <Typography textAlign="center">{page.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Typography
              variant="h4"
              noWrap
              component={Link}
              to="/"
              color="inherit"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                display: { xs: "flex", md: "none" },
              }}
            >
              RISCs
            </Typography>

            {/* Navigation Links: Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center", alignItems: "center" }}>
              {pages.map((page) => (
                <Button
                  key={page.label}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.route}
                  sx={{ my: 2, color: teal[50], display: "block" }}
                >
                  {page.label}
                </Button>
              ))}
            
              <Button onClick={toggleDarkMode} sx={{ my: 2, color: teal[50], display: "block", marginLeft: "auto" }}>
              {darkMode ? <DarkModeIcon  /> :
              <DarkModeOutlinedIcon />}
              </Button>

              <Button onClick={toggleFilterShow} sx={{ my: 2, color: teal[50], display: "block"}}>
              {filterShow ? <FilterAltIcon  /> :
              <FilterAltOutlinedIcon />}
              </Button>
              
               
            </Box>
            
          </Toolbar>
        </Container>
      </AppBar>

      {/* Displays component that matches route (defined in index.tsx) */}
      <Outlet />
    </Box>
  );
}

export default App;
