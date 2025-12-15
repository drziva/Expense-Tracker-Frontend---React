import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Dashboard",
    to: "/app/dashboard"
  },
  {
    label: "Incomes",
    to: "/app/incomes"
  },
  {
    label: "Expenses",
    to: "/app/expenses"
  }
]

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
       {navItems.map((item)=>(
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          sx={{
            "&.active": {
              backgroundColor: "action.selected",
              color: "primary.main",
            },
          }}
        >
          <ListItemText primary={item.label}/>
        </ListItemButton>
       ))
       }
      </List>
    </Box>
  )
}