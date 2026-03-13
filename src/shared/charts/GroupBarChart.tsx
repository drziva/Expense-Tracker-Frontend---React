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
import { useMediaQuery } from "@mui/material"

type DataPoint = {
  groupName: string
  total: number
}

export function GroupBarChart({ data }: { data: DataPoint[] }) {
  const theme = useTheme()
  const isMobile = useMediaQuery("(max-width: 600px)");
  const isMedium = useMediaQuery("(max-width: 900px)");


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
        barSize={isMobile ? 20 : 40}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={theme.palette.divider}
        />

        <XAxis
          dataKey="groupName"
          tick={ !isMobile ? { fontSize: 12, fill: theme.palette.text.primary } : false }
          tickFormatter={(value) => {
            isMedium ? ( value.length > 10 && (value = value.slice(0,10) + "...")) : null;
            return value.length > 15 ? value.slice(0, 15) + "..." : value
          }}
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