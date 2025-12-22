import { useMutation } from "@tanstack/react-query";
import { getReportEmail } from "../../api/reports.api";
import { useToast } from "../../toast/ToastProvider";

export function useReportEmail() {
const { showToast } = useToast();

  return useMutation({
    mutationFn: getReportEmail,
    onSuccess:() => {
      showToast("Email sent successfully!");
    },
    onError: () => {
      showToast("Failed to send email, please try again.", "error")
    }
  })
}