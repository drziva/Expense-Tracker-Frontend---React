import { Alert, CircularProgress, useMediaQuery } from "@mui/material";
import { useScheduledTransactions } from "../hooks/scheduled-transactions/useScheduledTransactions";
import { Table, type Column } from "../components/ui/Table";
import type { ScheduledTransaction } from "../types/scheduledTransactions.responses";
import formatEuros from "../utils/formatMoney";
import { MobileScheduledTable } from "../components/mobile/MobileScheduledTable";

export function ScheduledTransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const {data, isPending, isError} = useScheduledTransactions();

  if(isPending) return <CircularProgress />
  if(isError) return <Alert severity="error">There has been an error loading the transactions</Alert>

  const txColumns: Column<ScheduledTransaction>[] = [
    {
      key: "description",
      header: "Description",
      render: tx => tx.description
    },
    {
      key: "amount",
      header: "Amount",
      render: tx => formatEuros(tx.amount)
    },
    {
      key: "date",
      header: "Date",
      render: tx => new Date(tx.date).toLocaleDateString()
    },
    {
      key: "type",
      header: "Type",
      render: tx => tx.type
    },
    {
      key: "group",
      header: "Group",
      render: tx => (
        tx.type === "expense" ? tx.expenseGroupId : tx.incomeGroupId
      )
    }
  ]

  return(  
    <>    
      {!isMobile &&(<Table
        rows={data}
        columns={txColumns}
        getRowKey={tx=>tx.id}
      />)}
      {isMobile && (
        <MobileScheduledTable
          data={data}
        />
      )}
    </>

  )
}