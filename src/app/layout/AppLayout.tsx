import { Box, CircularProgress, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "@/app/layout/Header";
import Sidebar from "@/app/layout/Sidebar";
import { Suspense, useState } from "react";
import { PageErrorBoundary } from "@/shared/errors/PageErrorBoundary";

export default function AppLayout() {
  const theme = useTheme();

  const isMobile = useMediaQuery("(max-width: 1000px)");

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
        
        <Box sx={{ flex: 1, p: 3, ml: isMobile ? 0 : "240px", mt: "84px", overflowY: "auto" }}>
          <Suspense
            fallback={
                <CircularProgress />
            }
          >
            <PageErrorBoundary>
              <Outlet />
            </PageErrorBoundary>
          </Suspense>
        </Box>

      </Box>
    </Box>
  );
}
