import {Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";

type Props = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function Header({onMenuClick, showMenuButton}: Props) {
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
      { showMenuButton && (
        <IconButton onClick={onMenuClick}>
          <MenuIcon fontSize="small"/>
        </IconButton>
      )

      }

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
      <Typography variant={showMenuButton ? "h5" :"h4"}>
        Expense Tracker
      </Typography>
    </Box>
  )
}