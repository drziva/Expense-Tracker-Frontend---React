import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import formatEuros from "@/shared/lib/formatMoney";
import { useTheme } from "@mui/material/styles";

type Props = {
  data: {
    date: string;
    total: number;
  }[],
  color: string,
  type?: "year" | "month" | "week"
}

const formatCompact = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`
  }

  return value
}


export function TimelineChart({ data, color, type }: Props) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          interval="preserveStartEnd"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString("en-US", {
              month: "short",
              ...(type === "year" ? { year: "numeric" } : {}),
              ...(type === "week" ? { weekday: "short" } : {}),
              ...(type === "year" ? {} : { day: "numeric" })
            })
          }
        />
        <YAxis 
            tick={{ fontSize: 12, fill: theme.palette.text.primary }}
            tickFormatter={(value) => `${formatCompact(value)}€`}
        />

        <Tooltip 
            formatter={(value) => [formatEuros(Number(value)), "Total"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                fontSize: "12px"
            }}
            labelStyle={{
                color: theme.palette.text.secondary
            }}
            itemStyle={{
                color: color === "income" ? theme.palette.primary.main : theme.palette.error.main
            }}
        />

        <Area
          type="bumpX"
          dataKey="total"
          stroke={color === "income" ? "rgb(12, 216, 199)" : "rgb(12, 216, 199)"}
          fill={color === "income" ? "#28bbc633" : "#28bbc633"}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}