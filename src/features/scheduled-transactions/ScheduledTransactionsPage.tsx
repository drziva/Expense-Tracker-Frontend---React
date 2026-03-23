import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Switch,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

import { useSchedTransactions } from "@/features/scheduled-transactions/hooks/useSchedTransactions";
import { useDeleteSchedTransaction } from "@/features/scheduled-transactions/hooks/useDeleteSchedTransaction";

import type { SchedTransaction } from "@/features/scheduled-transactions/types/scheduled-transactions.responses";
import { Table, type Column } from "@/shared/ui/Table";
import ConfirmDialog from "@/shared/ui/ConfirmDialog";
import { ScheduledTransactionDialog } from "@/features/scheduled-transactions/components/ScheduledTransactionDialog";
import { MobileSchedTransactionsTable } from "@/shared/mobile/MobileSchedTransactionsTable";

import formatEuros from "@/shared/lib/formatMoney";
import { capitalizeFirst } from "@/shared/lib/capitalizeFirst";
import { PremiumRequiredPage } from "@/features/scheduled-transactions/pages/PremiumRequiredPage";
import { AxiosError } from "axios";
import { EmptyState } from "@/shared/ui/EmptyState";
import { set } from "zod";
import AddEntityButton from "@/shared/components/AddEntityButton";
import { ADD_TRANSACTION_TEXT } from "@/shared/constants/app.constants";

export default function ScheduledTransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const { data, isLoading, isError, error } = useSchedTransactions();
  const deleteTransaction = useDeleteSchedTransaction();

  const [toCreate, setToCreate] = useState(false);
  const [toUpdate, setToUpdate] = useState<SchedTransaction | null>(null);
  const [toDelete, setToDelete] = useState<SchedTransaction | null>(null);
  const [prevDelete, setPrevDelete] = useState<SchedTransaction | null>(null);
  const [toClose, setToClose] = useState(false);
  const [formDirty, setFormDirty] = useState(false);

  const isEmpty = !data || data.length === 0;

  const isPremiumError =
    isError &&
    error instanceof AxiosError &&
    error.response?.status === 403;

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isPremiumError) {
    return <PremiumRequiredPage />;
  }

  if (isError) {
    return (
      <Alert severity="error">
        There has been an error loading the transactions
      </Alert>
    );
  }

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
              setPrevDelete(tx);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? 1 : 0,
          mb: 2,
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={600}>
          Scheduled Transactions
        </Typography>

      <AddEntityButton
        onClick={() => setToCreate(true)}
        title={ADD_TRANSACTION_TEXT}
      />
      </Box>

      <Paper sx={{ p: 2 }}>
        {!isMobile && (
          (isEmpty ? (
            <EmptyState name="scheduled transactions" />
          ) : (
            <Table
              rows={data ?? []}
              columns={columns}
              getRowKey={tx => tx.id}
            />
          ))
        )}

        {isMobile && (
          (isEmpty ? (
            <EmptyState name="scheduled transactions" />
          ) : (
            (<MobileSchedTransactionsTable
              data={data ?? []}
              onEdit={setToUpdate}
              onDelete={setToDelete}
            />)
          ))
        )}
      </Paper>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete scheduled transaction"
        action="Delete"
        description={`Are you sure you want to delete "${prevDelete?.description}"?`}
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
        title="Create"
        onClose={() => {
          if(formDirty) {
            setToClose(true);
            return;
          }
          setToCreate(false)
          setFormDirty(false);          
        }}
        onChange={setFormDirty}
        onSuccess={() => {
          setToCreate(false);
        }}
      />

      <ScheduledTransactionDialog
        open={!!toUpdate}
        title="Edit"
        transaction={toUpdate}
        onClose={() => {
          if(formDirty) {
            setToClose(true);
            return;
          }
          setToUpdate(null);
          setFormDirty(false);
        }}
        onChange={setFormDirty}
        onSuccess={() => {
          setToUpdate(null);
        }}
      />

      <ConfirmDialog
        open={toClose}
        title="Unsaved changes"
        action="Discard"
        description="You have unsaved changes. Are you sure you want to leave this page?"
        onConfirm={() => {
          setToUpdate(null);
          setToCreate(false);
          setFormDirty(false);
          setToClose(false);
        }}
        onCancel={() => setToClose(false)}
      />
    </>
  );
}
