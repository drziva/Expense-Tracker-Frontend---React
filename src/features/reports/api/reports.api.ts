import { AxiosError } from "axios";
import type { FilteredReportQuery, ReportQuery } from "@/features/reports/types/reports.requests";
import type { ReportPdfResponse } from "@/features/reports/types/reports.responses";
import { api } from "@/shared/api/client";
import { IncomeQuery } from "@/features/incomes/types/incomes.requests";
import { ExpenseQuery } from "@/features/expenses/types/expenses.requests";

export async function getReportPdf(
  query: ReportQuery
): Promise<ReportPdfResponse>{
  try {
      const res = await api.get("/reports/pdf", {
      params: query,
      responseType: "blob",
      });

      const disposition = res.headers["content-disposition"];
      const filename = extractFilename(disposition) ?? "report.pdf";

      return {
        blob: res.data,
        filename,
      }
    } catch (error) {
      if ( error instanceof AxiosError && error.response?.data instanceof Blob ) {
        const text = await error.response.data.text();

        let message = "Unknown error";

        try {
          const json = JSON.parse(text);
          message = json.message ?? message;
        } catch {
          message = text;
        }
        throw new Error(message);
      }

      throw error;
    }
}

export async function getFilteredReportPdf(
  type: "incomes" | "expenses",
  query: IncomeQuery | ExpenseQuery
): Promise<ReportPdfResponse>{
  try {
      const res = await api.get(`/reports/${type}/pdf`, {
      params: query,
      responseType: "blob",
      });

      const disposition = res.headers["content-disposition"];
      const filename = extractFilename(disposition) ?? "report.pdf";

      return {
        blob: res.data,
        filename,
      }
    } catch (error) {
      if ( error instanceof AxiosError && error.response?.data instanceof Blob ) {
        const text = await error.response.data.text();

        let message = "Unknown error";

        try {
          const json = JSON.parse(text);
          message = json.message ?? message;
        } catch {
          message = text;
        }
        throw new Error(message);
      }

      throw error;
    }
}

export async function getReportEmail(query: ReportQuery) {
  const res = await api.get("/reports/email", { params: query });
  return res.data;
}

function extractFilename(disposition?: string): string | null {
  if (!disposition) return null;

  const utf8Match = disposition.match(/filename\*\=UTF-8''(.+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return null;
}
