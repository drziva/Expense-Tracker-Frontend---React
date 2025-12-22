import { Box, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Suspense, useState } from "react";

export default function AppLayout() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header
        showMenuButton={isMobile}
        onMenuClick={() => setMobileNavOpen(true)}
      />

      <Box sx={{ 
        display: "flex", 
        flex: 1, 
        bgcolor: "background.default", 
      }}>

        {!isMobile && <Sidebar/>}

        {isMobile && (
          <Drawer
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            variant="temporary"
            ModalProps={{ keepMounted: true }}
          >
            <Sidebar hideSidebar={() => setMobileNavOpen(false)}/>
          </Drawer>
        )
        }
        
        <Box sx={{ flex: 1, p: 3}}>
          <Suspense
            fallback={
                <CircularProgress />
            }
          >
            <Outlet />
          </Suspense>
        </Box>

      </Box>
    </Box>
  );
}
