import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

import { useTheme } from "@mui/material/styles"
import formatEuros from "@/shared/lib/formatMoney"

type DataPoint = {
  groupName: string
  total: number
}

export function GroupBarChart({ data }: { data: DataPoint[] }) {
  const theme = useTheme()

  const formatCompact = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        barCategoryGap="30%"
        
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
        />

        <XAxis
          dataKey="groupName"
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          interval={0}
        />

        <YAxis
          width={60}
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          tickFormatter={(value) => `${formatCompact(value)}€`}
        />

        <Tooltip
          cursor={false}
          formatter={(value) => [
            formatEuros(Number(value)),
            "Total"
          ]}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            fontSize: 12
          }}
        />

        <Bar
          dataKey="total"
          fill={theme.palette.primary.main}
          radius={[6, 6, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}