import { Alert, Box, CircularProgress, Paper, Typography, useMediaQuery } from "@mui/material";
import { useDashboard } from "../hooks/useDashboard";
import { Table, type Column } from "../components/ui/Table";
import { DashboardTableSection } from "../components/dashboard/DashboardTableSection";
import formatEuros from "../utils/formatMoney"
import type { Expense } from "../types/expenses.responses";
import type { Income } from "../types/incomes.responses";
import { MobileTransactionCard } from "../components/mobile/MobileTransactionCard";

export default function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 600px)")

  const { data, isError, isLoading } = useDashboard();

  if(isError) return <Alert severity="error">There was an error loading the dashboard page.</Alert>
  if(isLoading) return <CircularProgress/>

  const txColumns: Column<Expense | Income>[] = [
    {
      key:"description",
      header:"Description",
      render: tx => tx.description
    },
    {
      key:"amount",
      header:"Amount",
      align: "right",
      render: tx => formatEuros(tx.amount)
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
          <Typography variant={isMobile ? "h4" :"h3"} fontWeight={700}>
            {formatEuros(data?.balance ?? 0)}
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
        {!isMobile && (
          <>
            <DashboardTableSection
            title="Total Incomes"
            total={data!.totalIncomes}
            color="success.main"
            sign="+"
            >
              <Table
                rows={data?.incomes ?? []}
                columns={txColumns}
                getRowKey={tx=> tx.id}/>

            </DashboardTableSection>
            <DashboardTableSection
              title="Total Expenses"
              total={data!.totalExpenses}
              color="error.main"
              sign="-"
            >
              <Table
                rows={data?.expenses ?? []}
                columns={txColumns}
                getRowKey={tx=> tx.id}
              />
            </DashboardTableSection>
          </>
        )}
        
        {isMobile && (
          <>
            <DashboardTableSection
              title="Total Incomes"
              total={data!.totalIncomes}
              color="success.main"
              sign="+"
            >
              <MobileTransactionCard
                data={data?.incomes}
                color="success.main"
              />
            </DashboardTableSection>

            <DashboardTableSection
              title="Total Expenses"
              total={data!.totalExpenses}
              color="error.main"
              sign="-"
            >
              <MobileTransactionCard
                data={data?.expenses}
                color="error.main"
              />  
            </DashboardTableSection>
          </>
        )}
      </Box>
    </Box>
  )
}