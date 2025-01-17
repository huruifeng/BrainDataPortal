import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);

  const openHelpMenu = (event) => setHelpMenuAnchor(event.currentTarget);
  const closeHelpMenu = () => setHelpMenuAnchor(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            BrainDataPortal
          </Link>
        </Typography>
        <Button color="inherit" component={Link} to="/about">About</Button>
        <Button color="inherit" component={Link} to="/data">Data</Button>
        <Button color="inherit" component={Link} to="/analysis">Analysis</Button>
        <Button color="inherit" onClick={openHelpMenu}>Help</Button>
        <Menu
          anchorEl={helpMenuAnchor}
          open={Boolean(helpMenuAnchor)}
          onClose={closeHelpMenu}
        >
          <MenuItem component={Link} to="/help/how-to-use" onClick={closeHelpMenu}>How to Use</MenuItem>
          <MenuItem component={Link} to="/help/faq" onClick={closeHelpMenu}>FAQ</MenuItem>
          <MenuItem divider />
          <MenuItem component={Link} to="/help/rest-api" onClick={closeHelpMenu}>REST API</MenuItem>
        </Menu>
        <Button color="inherit" component={Link} to="/login">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
