import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useDashboard } from "../hooks/useDashboard";
import type { Transaction } from "../types/transaction";
import { GenericTable, type Column } from "../components/GenericTable";
import { DashboardTableSection } from "../components/DashboardTableSection";
import formatMoney from "../utils/formatMoney";

export default function DashboardPage() {
  const { data, isError, isLoading } = useDashboard();

  if(isError) return <Alert severity="error">There was an error loading the dashboard page.</Alert>
  if(isLoading) return <CircularProgress/>

  const txColumns: Column<Transaction>[] = [
    {
      key:"description",
      header:"Description",
      render: tx => tx.description
    },
    {
      key:"amount",
      header:"Amount",
      align: "right",
      render: tx => formatMoney(tx.amount)
    },
    {
      key:"date",
      header:"Date",
      render: tx => new Date (tx.createdAt).toLocaleDateString()
    },
    {
      key:"group",
      header:"Group",
      render: tx => tx.groupName
    },    
  ]

  return(
    <Box
      sx={{
        display:"flex",
        flexDirection:"column",
        alignItems:"stretch"
      }}
    >
      <Paper
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1" color="text.secondary">
            Current balance:
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            {formatMoney(data?.balance ?? 0)}
          </Typography>
        </Box>

      </Paper>
      <Box
        sx={{
          display:"grid",
          gridTemplateColumns: { xs:"1fr", md:"1fr 1fr"},
          gap: 3
        }}
      >   
        <DashboardTableSection
          title="Total Incomes"
          total={data!.totalIncomes}
          color="success.main"
          sign="+"
        >
          <GenericTable
            rows={data?.incomes ?? []}
            columns={txColumns}
            getRowKey={tx=> tx.id}
          />
        </DashboardTableSection>

        <DashboardTableSection
          title="Total Expenses"
          total={data!.totalExpenses}
          color="error.main"
          sign="-"
        >
          <GenericTable
            rows={data?.expenses ?? []}
            columns={txColumns}
            getRowKey={tx=> tx.id}
          />
        </DashboardTableSection>
      </Box>
    </Box>
  )
}