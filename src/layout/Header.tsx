import {Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";


export default function Header() {
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
          src="/vega-it-logo.png"
          alt="VegaIT"
          sx={{height:102}}
        />
      </Box>
      <Typography variant="h4">
        Expense Tracker
      </Typography>
    </Box>
  )
}