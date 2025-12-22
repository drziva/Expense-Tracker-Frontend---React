import type { ReportQuery } from "../types/reports.requests";
import type { ReportPdfResponse } from "../types/reports.responses";
import { api } from "./client";

export async function getReportPdf(
  query: ReportQuery
): Promise<ReportPdfResponse> {
  const res = await api.get("/reports/pdf", {
    params: query,
    responseType: "blob",
  });

  const disposition = res.headers["content-disposition"];
  const filename =
    extractFilename(disposition) ?? "report.pdf";

  return {
    blob: res.data,
    filename,
  };
}

export async function getReportEmail(query: ReportQuery) {
  const res = await api.get("/reports/email", { params: query });
  return res.data;
}

function extractFilename(disposition?: string): string | null {
  if (!disposition) return null;

  // RFC 5987 format: filename*=UTF-8''file.pdf
  const utf8Match = disposition.match(/filename\*\=UTF-8''(.+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  // Basic format: filename="file.pdf"
  const asciiMatch = disposition.match(/filename="?([^"]+)"?/i);
  if (asciiMatch?.[1]) {
    return asciiMatch[1];
  }

  return null;
}
