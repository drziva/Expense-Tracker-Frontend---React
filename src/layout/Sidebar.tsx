import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Incomes", to: "/app/incomes" },
  { label: "Expenses", to: "/app/expenses" },
  { label: "Income Groups", to: "/app/income-groups" },
  { label: "Expense Groups", to: "/app/expense-groups" },
];

type Props = {
  hideSidebar?: () => void
}

export default function Sidebar({hideSidebar}: Props) {
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
          onClick={hideSidebar}
        >
          <ListItemText primary={item.label}/>
        </ListItemButton>
       ))
       }
      </List>
    </Box>
  )
}