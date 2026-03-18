import { Alert, Box, CircularProgress, Paper, Typography, useMediaQuery } from "@mui/material";
import { useDashboard, useDashboardSummary } from "@/features/dashboard/hooks/useDashboard";
import { Table, type Column } from "@/shared/ui/Table";
import { DashboardTableSection } from "@/features/dashboard/components/DashboardTableSection";
import formatEuros from "@/shared/lib/formatMoney"
import type { Expense } from "@/features/expenses/types/expenses.responses";
import type { Income } from "@/features/incomes/types/incomes.responses";
import { MobileTransactionCard } from "@/shared/mobile/MobileTransactionCard";
import { useEffect, useState } from "react";
import { DashboardTimelineChart } from "@/features/dashboard/components/DashboardTimelineChart";
import dayjs from "dayjs";

export default function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 600px)")

  const [summaryQuery, setSummaryQuery] = useState({
    from: dayjs().subtract(7, "day").startOf("day").toISOString(),
    to: dayjs().endOf("day").toISOString(),
  });

  const [detailsOpen, setDetailsOpen] = useState<Income | Expense | null>(null);

  const { data, isError, isLoading } = useDashboard();
  const {data: summaryData} = useDashboardSummary(summaryQuery);

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

  const timelineData =
    summaryData?.map(item => ({
      date: item.date,
      income: item.income ?? 0,
      expense: item.expense ?? 0
  })) ?? []

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
          <Typography variant={isMobile ? "h5" :"h3"} fontWeight={700}>
            {formatEuros(data?.balance ?? 0)}
          </Typography>
        </Box>

      </Paper>

      {!isMobile && (      
      <Paper
          sx={{
            mb: 2,
            p: 2,
          }}
        >
        <DashboardTimelineChart data={timelineData}/>
      </Paper>
      )}
      <Box
        sx={{
          display:"flex",
          flexDirection:"column",
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
                getRowKey={tx=> tx.id}
                onRowClick={(tx) => {
                  location.href = `/app/incomes?search=${tx.description}`
                }}  
              />

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
                onRowClick={(tx) => {
                  location.href = `/app/expenses?search=${tx.description}`
                }}
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
                onClick={(tx) => {
                  location.href = `/app/incomes?search=${tx.description}`
                }}
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
                onClick={(tx) => {
                  location.href = `/app/expenses?search=${tx.description}`
                }}
              />  
            </DashboardTableSection>
          </>
        )}
      </Box>
    </Box>
  )
}