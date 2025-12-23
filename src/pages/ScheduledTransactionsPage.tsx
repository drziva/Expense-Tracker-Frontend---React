import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

import { useSchedTransactions } from "../hooks/scheduled-transactions/useSchedTransactions";
import { useDeleteSchedTransaction } from "../hooks/scheduled-transactions/useDeleteSchedTransaction";

import type { SchedTransaction } from "../types/scheduled-transactions.responses";
import { Table, type Column } from "../components/ui/Table";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { ScheduledTransactionDialog } from "../components/scheduled-transactions/ScheduledTransactionDialog";
import { MobileSchedTransactionsTable } from "../components/mobile/MobileSchedTransactionsTable";

import formatEuros from "../utils/formatMoney";
import { capitalizeFirst } from "../utils/capitalizeFirst";
import { useAuth } from "../auth/AuthProvider";
import { PremiumRequiredPage } from "./PremiumRequiredPage";

export default function ScheduledTransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isPremium = useAuth().isPremium;

  const { data, isPending, isError } = useSchedTransactions();
  const deleteTransaction = useDeleteSchedTransaction();

  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<SchedTransaction | null>(null);
  const [toDelete, setToDelete] = useState<SchedTransaction | null>(null);

  if (isPending) return <CircularProgress />;
  if (isError)
    return (
      <Alert severity="error">
        Failed to load scheduled transactions.
      </Alert>
    );

  const columns: Column<SchedTransaction>[] = [
    {
      key: "description",
      header: "Description",
      render: tx => capitalizeFirst(tx.description),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: tx => formatEuros(tx.amount),
    },
    {
      key: "date",
      header: "Date",
      render: tx => new Date(tx.date).toLocaleDateString(),
    },
    {
      key: "type",
      header: "Type",
      render: tx => capitalizeFirst(tx.type),
    },
    {
      key: "group",
      header: "Group",
      render: tx =>
        tx.type === "income"
          ? tx.incomeGroupName
          : tx.expenseGroupName,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: tx => (
        <>
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToUpdate(tx);
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              setToDelete(tx);
            }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      {!isPremium &&
        <PremiumRequiredPage/>
      }
      {isPremium && (
        <>
          <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">
            Scheduled Transactions
          </Typography>

          <Button
            variant="contained"
            onClick={() => setToCreate(true)}
            sx={{
              height: 40,
              fontSize: "0.75rem",
              lineHeight: "1.1",
            }}
          >
            <strong>Add Transaction</strong>
          </Button>
        </Box>

        <Paper sx={{ p: 2 }}>
          {!isMobile && (
            <Table
              rows={data ?? []}
              columns={columns}
              getRowKey={tx => tx.id}
            />
          )}

          {isMobile && (
            <MobileSchedTransactionsTable
              data={data ?? []}
              onEdit={setToUpdate}
              onDelete={setToDelete}
            />
          )}
        </Paper>

        <ConfirmDialog
          open={!!toDelete}
          title="Delete scheduled transaction"
          action="Delete"
          description={`Are you sure you want to delete "${toDelete?.description}"?`}
          loading={deleteTransaction.isPending}
          onCancel={() => setToDelete(null)}
          onConfirm={() => {
            if (!toDelete) return;
            deleteTransaction.mutate(toDelete.id);
            setToDelete(null);
          }}
        />

        <ScheduledTransactionDialog
          open={toCreate}
          onClose={() => setToCreate(false)}
        />

        <ScheduledTransactionDialog
          open={!!toUpdate}
          transaction={toUpdate}
          onClose={() => setToUpdate(null)}
        />
      </>
      )}
    </>
  );
}
