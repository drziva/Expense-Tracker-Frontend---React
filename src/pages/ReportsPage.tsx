import { Box, Button, Divider, Typography, Paper } from "@mui/material";
import { useDownloadReportPdf } from "../hooks/reports/useDownloadReportPdf";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

export function ReportsPage() {
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);

  const downloadReportPdf = useDownloadReportPdf();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    downloadReportPdf.mutate({
      from: fromDate?.format("YYYY-MM-DD"),
      to: toDate?.format("YYYY-MM-DD"),
    });
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Page header */}
      <Typography variant="h4" fontWeight={600}>
        Reports
      </Typography>

      <Typography variant="body2" color="text.secondary" mt={0.5}>
        Generate and download financial reports in PDF format.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Content section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
          maxWidth: 720,
        }}
      >
        <Typography variant="h6" fontWeight={500} mb={2}>
          PDF Report
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "flex-end",
          }}
        >
          <DatePicker
            label="From"
            value={fromDate}
            onChange={(date) => setFromDate(date)}
          />

          <DatePicker
            label="To"
            value={toDate}
            onChange={(date) => setToDate(date)}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              height: 56,
              px: 4,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Download PDF
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
