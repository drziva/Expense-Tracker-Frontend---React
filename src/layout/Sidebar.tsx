import { Box, List, ListItemButton, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Incomes", to: "/app/incomes" },
  { label: "Expenses", to: "/app/expenses" },
  { label: "Income Groups", to: "/app/income-groups" },
  { label: "Expense Groups", to: "/app/expense-groups" },
  { label: "Reports", to:"/app/reports"},
  { label: "Scheduled Transactions", to:"/app/scheduled-transactions"},
];

type Props = {
  hideSidebar?: () => void
}

export default function Sidebar({hideSidebar}: Props) {
  const theme = useTheme(); 
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isDark = theme.palette.mode === "dark"

  return(
    <Box
      sx={{
        width: 240,
        borderRight: "1px solid",
        borderColor: "divider",
        py: 2, 
    }}>
      {isMobile && (
         <Box
          component="img"
          src="/vega-it-logo-2.png"
          alt="VegaIT"
          sx={{
            height: 70,
            filter: isDark ? "invert(1)" : "none",
            transition: "filter 0.2s ease",
          }}
        />
      )}
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