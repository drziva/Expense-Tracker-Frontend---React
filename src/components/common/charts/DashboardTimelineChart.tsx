import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import formatEuros from "../../../utils/formatMoney"
import { useTheme } from "@mui/material/styles"

type DataPoint = {
  date: string
  income: number
  expense: number
}

export function DashboardTimelineChart({ data }: { data: DataPoint[] }) {
  const theme = useTheme()

  const formatCompact = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
        />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />

        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${formatCompact(value)}€`}
        />

        <Tooltip
          formatter={(value, name) => [
            formatEuros(Number(value)),
            name === "income" ? "Income" : "Expense"
          ]}
          labelFormatter={(label) =>
            new Date(label).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            fontSize: 12
          }}
        />

        <Area
          type="monotone"
          dataKey="income"
          stroke="#4caf50"
          fill="#71b87333"
          strokeWidth={2}
        />

        <Area
          type="monotone"
          dataKey="expense"
          stroke="#e95858"
          fill="#df5e5e33"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}