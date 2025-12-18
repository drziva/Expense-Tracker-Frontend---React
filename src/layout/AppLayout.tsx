import { Box, CircularProgress } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Suspense } from "react";

export default function AppLayout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header/>
      <Box sx={{ display: "flex", flex: 1 }}>

        <Sidebar/>
        
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
