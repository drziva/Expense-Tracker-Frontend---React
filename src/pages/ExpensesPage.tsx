import { Alert, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useExpenses } from "../hooks/useExpenses";


export default function ExpensesPage() { 
  const {data, isLoading, isError} = useExpenses();

  if(isLoading) {
    return <CircularProgress/>;
  }

  if(isError) {
    return <Alert severity="error">Failed to load expenses.</Alert>;
  }

  return (
    <>
      <Typography variant="h5" sx={{mb:2}}>
        Expenses
      </Typography>

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount (€)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Group</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data!.data.map((expense) => (
              <TableRow 
                hover sx={{cursor:"pointer"}} 
                key={expense.id}>
                <TableCell>{expense.description}</TableCell>
                <TableCell align="right">
                  {expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {new Date(expense.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{expense.groupName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}