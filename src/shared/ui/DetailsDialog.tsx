import {
  Box,
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
  onEdit?: (item: Expense | Income | IncomeGroup | ExpenseGroup | SchedTransaction | null ) => void
}

    function Field({ label,value, multiline = false}: { label: string, value: React.ReactNode, multiline?: boolean }) {
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

function Details({ data }: { data: DetailsData }) {
    if(!data || data.item === null) return;
  switch (data.type) {
    case "expense":
      return (
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3 }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ReceiptIcon color="error" />
              <Typography variant="h6">Expense</Typography>
            </Stack>

            <Divider />

            <Field label="Description" value={data.item.description} />

            <Field
              label="Amount"
              value={formatEuros(data.item.amount)}
            />

            <Field
              label="Date"
              value={new Date(data.item.createdAt).toLocaleDateString()}
            />
          </Stack>
        </Paper>
      )

    case "income":
      return (
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3 }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PaymentsIcon color="success" />
              <Typography variant="h6">Income</Typography>
            </Stack>

            <Divider />

            <Field label="Source" value={data.item.description} />

            <Field
              label="Amount"
              value={formatEuros(data.item.amount)}
            />

            <Field
              label="Date"
              value={new Date(data.item.createdAt).toLocaleDateString()}
            />
          </Stack>
        </Paper>
      )

    case "income_group":
      return (
        <Paper
          variant="outlined"
          sx={{ p: 3, borderRadius: 3 }}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PaymentsIcon color="success" />
              <Typography variant="h6">Income Group</Typography>
            </Stack>

            <Divider />

            <Field label="Description" multiline={true} value={data.item.description} />

            <Field
              label="Date Created"
              multiline={true}
              value={"•  " + new Date(data.item.createdAt).toLocaleDateString()}
            />

            <Button 
                variant="outlined" 
                onClick={()=>{
                    location.href = `/app/incomes?group=${data!.item!.id}`
                }}
            >
                View Incomes for group
            </Button>
          </Stack>
        </Paper>
      )

      case "expense_group": 
        return (
            <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 3 }}
            >
            <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                <ReceiptIcon color="error" />
                <Typography variant="h6">Expense Group</Typography>
                </Stack>

                <Divider />

                <Field label="Description" multiline={true} value={data.item.description} />

                <Field label="Budget Cap" multiline={true} value={data.item.budgetCap ? formatEuros(data.item.budgetCap) : "-"}/>

                <Field
                label="Date Created"
                multiline={true}
                value={"•  " + new Date(data.item.createdAt).toLocaleDateString()}
                />

                <Button 
                    variant="outlined" 
                    onClick={()=>{
                        location.href = `/app/expenses?group=${data!.item!.id}`
                    }}
                >
                    View Expenses for group
                </Button>
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

export function DetailsDialog({ open, data, onClose, onEdit }: Props) {
    if(!data) return;
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
        {data && <Details data={data} />}
      </DialogContent>

      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button
          variant="outlined"
          onClick={() => {
            onEdit && onEdit(data.item);
          }}
          sx={{ borderRadius: 2 }}
        >
          Edit
        </Button>

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