import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  Paper
} from "@mui/material"

import ReceiptIcon from "@mui/icons-material/Receipt"
import PaymentsIcon from "@mui/icons-material/Payments"

import { ExpenseGroup } from "@/features/expense-groups/types/expenseGroup.responses"
import { Expense } from "@/features/expenses/types/expenses.responses"
import { IncomeGroup } from "@/features/income-groups/types/incomeGroup.responses"
import { Income } from "@/features/incomes/types/incomes.responses"
import { SchedTransaction } from "@/features/scheduled-transactions/types/scheduled-transactions.responses"

import formatEuros from "../lib/formatMoney"

type DetailsData =
  | { type: "expense"; item: Expense | null }
  | { type: "income"; item: Income | null }
  | { type: "income_group"; item: IncomeGroup | null }
  | { type: "expense_group"; item: ExpenseGroup | null }
  | { type: "scheduled"; item: SchedTransaction | null }

type Props = {
  open: boolean
  onClose: () => void
  data?: DetailsData | null
  onEdit?: (item: Expense | Income | IncomeGroup | ExpenseGroup | SchedTransaction | null) => void
  onDelete?: (item: Expense | Income | IncomeGroup | ExpenseGroup | SchedTransaction | null) => void
}

function Field({ label, value, multiline = false }: { label: string, value: React.ReactNode, multiline?: boolean }) {

  if (multiline) {
    return (
      <Stack spacing={0.5}>
        <Typography color="text.primary" fontWeight={500}>
          {label}
        </Typography>

        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            color: "text.secondary"
          }}
        >
          {value}
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  )
}

/* ---------------- Buttons ---------------- */

function EditButton({ item, onEdit, label }: {
  item: any
  onEdit?: Props["onEdit"]
  label?: string
}) {
  return (
    <Button
      variant="outlined"
      onClick={() => onEdit?.(item)}
      sx={{ borderRadius: 2 }}
    >
      {label ?? "Edit"}
    </Button>
  )
}

function DeleteButton({ item, onDelete, label }: {
  item: any
  onDelete?: Props["onDelete"]
  label?: string
}) {
  return (
    <Button
      variant="outlined"
      color="error"
      onClick={() => onDelete?.(item)}
      sx={{ borderRadius: 2 }}
    >
      {label ?? "Delete"}
    </Button>
  )
}

function ViewGroupButton({ href, label }: { href: string, label: string }) {
  return (
    <Button
      variant="outlined"
      onClick={() => {
        location.href = href
      }}
    >
      {label}
    </Button>
  )
}

/* ---------------- Details ---------------- */

function Details({ data, onEdit, onDelete }: {
  data: DetailsData
  onEdit?: Props["onEdit"]
  onDelete?: Props["onDelete"]
}) {

  if (!data || data.item === null) return null

  switch (data.type) {

    case "expense":
      return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>

            <Stack direction="row" alignItems="center" spacing={1}>
              <ReceiptIcon color="error" />
              <Typography variant="h6">Expense</Typography>
            </Stack>

            <Divider />

            <Field label="Description" value={data.item.description} />
            <Field label="Amount" value={formatEuros(data.item.amount)} />
            <Field label="Date Created" value={new Date(data.item.createdAt).toLocaleDateString()} />

            <Stack gap={0.5}>
              <EditButton item={data.item} onEdit={onEdit} label="Edit Expense" />
              <DeleteButton item={data.item} onDelete={onDelete} label="Delete Expense" />
            </Stack>

          </Stack>
        </Paper>
      )

    case "income":
      return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>

            <Stack direction="row" alignItems="center" spacing={1}>
              <PaymentsIcon color="success" />
              <Typography variant="h6">Income</Typography>
            </Stack>

            <Divider />

            <Field label="Source" value={data.item.description} />
            <Field label="Amount" value={formatEuros(data.item.amount)} />
            <Field label="Date Created" value={new Date(data.item.createdAt).toLocaleDateString()} />

            <Stack gap={0.5}>
              <EditButton item={data.item} onEdit={onEdit} label="Edit Income" />
              <DeleteButton item={data.item} onDelete={onDelete} label="Delete Income" />
            </Stack>
          </Stack>
        </Paper>
      )

    case "income_group":
      return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>

            <Stack direction="row" alignItems="center" spacing={1}>
              <PaymentsIcon color="success" />
              <Typography variant="h6">Income Group</Typography>
            </Stack>

            <Divider />

            <Field label="Description" multiline value={data.item.description} />
            <Field label="Date Created" multiline value={new Date(data.item.createdAt).toLocaleDateString()} />

            <ViewGroupButton
              href={`/app/incomes?group=${data.item.id}`}
              label="View Incomes for group"
            />

            <Stack gap={0.5}>
              <EditButton item={data.item} onEdit={onEdit} label="Edit Group" />
              <DeleteButton item={data.item} onDelete={onDelete} label="Delete Group" />
            </Stack>

          </Stack>
        </Paper>
      )

    case "expense_group":
      return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>

            <Stack direction="row" alignItems="center" spacing={1}>
              <ReceiptIcon color="error" />
              <Typography variant="h6">Expense Group</Typography>
            </Stack>

            <Divider />

            <Field label="Description" multiline value={data.item.description} />
            <Field label="Budget Cap" multiline value={data.item.budgetCap ? formatEuros(data.item.budgetCap) : "-"} />
            <Field label="Date Created" multiline value={new Date(data.item.createdAt).toLocaleDateString()} />

            <ViewGroupButton
              href={`/app/expenses?group=${data.item.id}`}
              label="View Expenses for group"
            />

            <Stack gap={0.5}>
              <EditButton item={data.item} onEdit={onEdit} label="Edit Group" />
              <DeleteButton item={data.item} onDelete={onDelete} label="Delete Group" />
            </Stack>
          </Stack>
        </Paper>
      )

    default:
      return (
        <Typography color="text.secondary">
          No details available
        </Typography>
      )
  }
}

export function DetailsDialog({ open, data, onClose, onEdit, onDelete }: Props) {

  if (!data) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Transaction Details
      </DialogTitle>

      <DialogContent>
        <Details data={data} onEdit={onEdit} onDelete={onDelete} />
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}