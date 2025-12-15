import {Box, Typography, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";


export default function Header() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        height:84,
        px:3,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid", 
        borderColor: "divider",
      }}
    >
      <Box 
        component={NavLink} 
        to="/app/dashboard" 
        sx={{display:"flex",alignItems:"center"}}
      >
        <Box
          component="img"
          src="/vega-it-logo-2.png"
          alt="VegaIT"
          sx={{
            height:102,
            filter: isDark ? "invert(1)": "none",
            transition: "filter 0.2s ease"
          }}
        />
      </Box>
      <Typography variant="h4">
        Expense Tracker
      </Typography>
    </Box>
  )
}