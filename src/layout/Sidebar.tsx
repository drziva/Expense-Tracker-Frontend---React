import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
  return(
    <Box
      sx={{
        width: 240,
        borderRight: "1px solid",
        borderColor: "divider",
        py: 2, 
    }}>
      <List>
        <ListItemButton 
          component={NavLink} 
          to="/app/dashboard"
          sx={{
            "&.active": {
              backgroundColor: "action.selected"
            }
          }}  
        >
          <ListItemText primary="Dashboard"/>
        </ListItemButton>

        <ListItemButton 
          component={NavLink} 
          to="/app/expenses"
          sx={{
            "&.active": {
              backgroundColor: "action.selected"
            }
          }}  
        >
          <ListItemText primary="Expenses"/>
        </ListItemButton>
      </List>
    </Box>
  )
}