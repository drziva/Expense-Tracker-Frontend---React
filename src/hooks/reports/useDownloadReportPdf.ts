import { useMutation } from "@tanstack/react-query";
import { getReportPdf } from "../../api/reports.api";
import type { ReportPdfResponse } from "../../types/reports.responses";
import type { ReportQuery } from "../../types/reports.requests";
import { useToast } from "../../toast/ToastProvider";

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
    onError: () => {
      showToast("PDF Generation failed, please try again", "error");
    }
  });
}
