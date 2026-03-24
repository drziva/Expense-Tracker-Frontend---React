import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { NavLink } from "react-router-dom";
import { useThemeMode } from "@/app/providers/theme/AppThemeProvider";
import { useEffect, useState } from "react";
import ProfileIcon from '@mui/icons-material/PermIdentity';
import { useAuth } from "@/features/auth/context/AuthProvider";

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { mode, toggleTheme } = useThemeMode();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [])

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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        bgcolor: "background.paper",
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
            filter: isDark ? "invert(1)" : "none"
          }}
        />
        {!showMenuButton &&(
          <>
            <Typography color="text.primary" variant={showMenuButton ? "h6" : "h4"}>
              Expense Tracker
            </Typography>
          </>

        )}
      </Box>

      <Box sx={{ flexGrow: 1 }} ></Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {/* <Box>
          <Tooltip title={!isOnline && "Offline"}>
            <Typography variant="body2" color={isOnline ? "success.main" : "warning.main"} sx={{cursor: "pointer"}}>   
              {isOnline ? "" : "Offline ○"}
            </Typography>
          </Tooltip>
        </Box> */}

        <IconButton onClick={toggleTheme} color="primary">
          <Tooltip
            title="Switch Theme"
          >
            {mode === "dark" ? <LightModeIcon fontSize="small"/> : <DarkModeIcon fontSize="small"/>}
          </Tooltip>
        </IconButton>        

        <IconButton 
          color="primary"
          onClick={e => setAnchorEl(e.currentTarget)}
          data-cy="user-button"
        >
          <Tooltip
            title="Profile"
          >
            <ProfileIcon fontSize="small"/>
          </Tooltip>
        </IconButton>
        <Menu
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        >
          <MenuItem
            data-cy="logout-button"
            onClick={()=>{
              setAnchorEl(null);
              logout();
          }}>Log out</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
