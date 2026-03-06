import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import formatEuros from "../../../utils/formatMoney";
import { useTheme } from "@mui/material/styles";

type Props = {
  data: {
    date: string;
    total: number;
  }[],
  color: string
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


export function TimelineChart({ data, color }: Props) {
  const theme = useTheme();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          interval="preserveStartEnd"
          tickFormatter={(date) =>
            new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
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
                color: color === "income" ? theme.palette.success.main : theme.palette.error.main
            }}
        />

        <Area
          type="bumpX"
          dataKey="total"
          stroke={color === "income" ? "#4caf50" : "#e94e4e"}
          fill={color === "income" ? "#4caf5033" : "#c6282833"}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}