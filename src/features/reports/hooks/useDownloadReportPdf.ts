import { useMutation } from "@tanstack/react-query";
import { getFilteredReportPdf, getReportPdf } from "@/features/reports/api/reports.api";
import type { ReportPdfResponse } from "@/features/reports/types/reports.responses";
import type { FilteredReportQuery, ReportQuery } from "@/features/reports/types/reports.requests";
import { useToast } from "@/app/providers/toast/ToastProvider";
import { IncomeQuery } from "@/features/incomes/types/incomes.requests";
import { ExpenseQuery } from "@/features/expenses/types/expenses.requests";

export function useDownloadReportPdf() {
  const { showToast } = useToast();

  return useMutation<ReportPdfResponse, Error, ReportQuery>({
    mutationFn: getReportPdf,
    onSuccess: ({ blob, filename }) => {
      showToast("PDF Generated Succesfully!")
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    },
    onError: (error) => {

      showToast(error.message, "error");
    }
  });
}

export function useDownloadFilteredReport(type: "incomes" | "expenses") {
  const { showToast } = useToast();

  return useMutation<ReportPdfResponse, Error, IncomeQuery | ExpenseQuery>({
    mutationFn: (query) => getFilteredReportPdf(type, query),
    onSuccess: ({ blob, filename }) => {
      showToast("PDF Generated Succesfully!")
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    },
    onError: (error) => {

      showToast(error.message, "error");
    }
  });
}
