import { Box, Button, Divider, Typography, Paper, Alert, useMediaQuery } from "@mui/material";
import { useDownloadReportPdf } from "../hooks/reports/useDownloadReportPdf";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useReportEmail } from "../hooks/reports/useReportEmail";
import { useAuth } from "../auth/AuthProvider";

export function ReportsPage() {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const [toDate, setToDate] = useState<dayjs.Dayjs | null>(null);

  const downloadReportPdf = useDownloadReportPdf();
  const emailReport = useReportEmail();
  
  const [formError, setFormError] = useState("");

  useEffect(()=>{
    setFormError("");
  },[fromDate,toDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const from = fromDate ? fromDate.format("YYYY-MM-DD") : undefined;
    const to = toDate ? toDate.format("YYYY-MM-DD") : undefined;

    if (!from || !to) {
      setFormError("Both date fields are required.");
      return;
    }

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    if(submitter.name === "download"){
        downloadReportPdf.mutate({
        from,
        to
      });
    }
    else {
      emailReport.mutate({
        from,
        to
      })
    }

  };

  return (
    <Box sx={{ px: { xs: 0, md: 4 }, py: 3 }}>
      <Typography variant={ isMobile ? "h5" :"h4"} fontWeight={600}>
        Reports
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" mt={0.5}>
        Generate and download a financial report in PDF format or have it sent to you via email.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1.5 : 3,
          borderRadius: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
          maxWidth: 720,
        }}
      >
        {formError && (<Alert severity="error">{formError}</Alert>)}
        
        <Typography variant={isMobile ? "subtitle1" :"h6"} fontWeight={500} mb={2}>
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
          <Box
            display="flex"
            gap="10px"
          >
            <Button
              type="submit"
              variant="contained"
              name="download"
              sx={{
                height: 56,
                px: 2,
                fontWeight: 600,
                textTransform: "none",
                lineHeight: 1.2
              }}
            >
              Download PDF
            </Button>

            <Button
              type="submit"
              variant="contained"
              name="email"
              sx={{
                height: 56,
                px: 2,
                fontWeight: 600,
                textTransform: "none",
                lineHeight: 1.2
              }}
            >
              Send via Email
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
