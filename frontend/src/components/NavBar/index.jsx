import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

import "./NavBar.css";

const NavBar = () => {
    const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);

    const openHelpMenu = (event) => setHelpMenuAnchor(event.currentTarget);
    const closeHelpMenu = () => setHelpMenuAnchor(null);

    return (
        <AppBar sx={{  }} position="static" className="navbar">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }} className="navbar-title">
                    <Link to="/" style={{ textDecoration: "none", color: "white", letterSpacing: "0rem" }}>
                        BrainDataPortal
                    </Link>
                </Typography>
                <Button color="inherit" component={Link} to="/about">About</Button>
                <Button color="inherit" component={Link} to="/datasets">Datasets</Button>
                <Button color="inherit" component={Link} to="/samples">Samples</Button>
                <Button color="inherit" component={Link} to="/xcheck">XCheck</Button>
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
