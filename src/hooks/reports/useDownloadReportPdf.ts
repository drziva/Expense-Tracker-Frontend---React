import { useMutation } from "@tanstack/react-query";
import { getReportPdf } from "../../api/reports.api";
import type { ReportPdfResponse } from "../../types/reports.responses";
import type { ReportQuery } from "../../types/reports.requests";

export function useDownloadReportPdf() {
  return useMutation<ReportPdfResponse, Error, ReportQuery>({
    mutationFn: getReportPdf,
    onSuccess: ({ blob, filename }) => {
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();

      URL.revokeObjectURL(url);
    },
  });
}
