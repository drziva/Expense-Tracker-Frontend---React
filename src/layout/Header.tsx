import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { NavLink } from "react-router-dom";
import { useThemeMode } from "../theme/AppThemeProvider";
import { useState } from "react";
import ProfileIcon from '@mui/icons-material/PermIdentity';
import { useAuth } from "../auth/AuthProvider";

type Props = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
};

export default function Header({ onMenuClick, showMenuButton }: Props) {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      sx={{
        height: 84,
        px: 3,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
        gap: 1,
      }}
    >
      {showMenuButton && (
        <IconButton onClick={onMenuClick}>
          <MenuIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        component={NavLink}
        to="/app/dashboard"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="img"
          src="/vega-it-logo-2.png"
          alt="VegaIT"
          sx={{
            height: showMenuButton ? 70 : 102,
            filter: isDark ? "invert(1)" : "none",
            transition: "filter 0.2s ease",
          }}
        />
        {!showMenuButton &&(
          <Typography color="text.primary" variant={showMenuButton ? "h6" : "h4"}>
            Expense Tracker
          </Typography>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box>
        <IconButton onClick={toggleTheme} color="primary">
          {mode === "dark" ? <LightModeIcon fontSize="small"/> : <DarkModeIcon fontSize="small"/>}
        </IconButton>        

        <IconButton 
          color="primary"
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          <ProfileIcon fontSize="small"/>
        </IconButton>
        <Menu
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        >
          <MenuItem onClick={()=>{
            setAnchorEl(null);
            logout();
          }}>Log out</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
