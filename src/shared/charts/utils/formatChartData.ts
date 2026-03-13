import { GroupSummary } from "@/shared/types/group"

export function formatBarChartData(data: GroupSummary[]) {
  if (!data?.length) return []

  const sorted = [...data].sort((a,b) => b.total - a.total)

  const top = sorted.slice(0,5)
  const other = sorted.slice(5)

  const otherTotal = other.reduce((sum, gr) => sum + gr.total, 0)

  return other.length
    ? [...top, { groupName: "Other", total: otherTotal }]
    : top
}