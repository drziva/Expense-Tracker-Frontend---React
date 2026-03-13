import { GroupSortOption } from "@/shared/types/pagination";

export type ReportQuery = {
  from?: string;
  to?: string;
}

export type FilteredReportQuery = {
  from?: string;
  to?: string;
  min?: number;
  max?: number;
  page?: number;
  limit?: number;
  sort?: GroupSortOption
  groupId?: number;
}