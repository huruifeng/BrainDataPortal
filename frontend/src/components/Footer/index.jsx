import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ textAlign: "center", padding: 2, backgroundColor: "#e6e6e6", fixed: "bottom"}}>
      <Typography variant="body2">© 2025 BrainDataPortal. All rights reserved.</Typography>
    </Box>
  );
};

export default Footer;
