import {
  Box,
  Paper,
  Switch,
  Typography,
  Divider,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../auth/AuthProvider";
import { useToggleNotifications } from "../hooks/useToggleNotifications";
import { useReminders } from "../hooks/reminders/useReminders";
import { useUpdateReminder } from "../hooks/reminders/useUpdateReminder";
import { ReminderCard } from "../components/reminders/ReminderCard";
import { AxiosError } from "axios";
import { PremiumRequiredPage } from "./PremiumRequiredPage";

export default function RemindersPage() {
  const toggleNotifications = useToggleNotifications();
  const updateReminder = useUpdateReminder();
  const user = useAuth().user;
  const { data, isError, isLoading, error } = useReminders();

  const isPremiumError =
      isError &&
      error instanceof AxiosError &&
      error.response?.status === 403;
  
    if (isLoading) {
      return <CircularProgress />;
    }
  
    if (isPremiumError) {
      return <PremiumRequiredPage />;
    }
  
    if (isError) {
      return (
        <Alert severity="error">
          There has been an error loading the transactions
        </Alert>
      );
    }

  const weeklyReminder = data?.find(r => r.type === "weekly") ?? null;
  const monthlyReminder = data?.find(r => r.type === "monthly") ?? null;

  const handleSaveReminder = (payload: {
    type: "weekly" | "monthly";
    active: boolean;
    weekday?: number;
    dayOfMonth?: number;
  }) => {
    updateReminder.mutate({
      type: payload.type,
      payload,
    });
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 680 }}>
      {/* ================= Notifications ================= */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          Budget cap notifications
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Automatic alerts when an expense group exceeds its configured budget.
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle2">
              Enable notifications
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Applies to all expense groups with a budget limit.
            </Typography>
          </Box>

          <Switch
            disabled={toggleNotifications.isPending}
            checked={user?.notifications}
            onChange={() => toggleNotifications.mutate()}
          />
        </Box>
      </Paper>

      {/* ================= Reminders ================= */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Scheduled spending reports
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Receive automated summaries of your spending by email.  
          You can schedule weekly and monthly reports independently.
        </Typography>

        <Stack spacing={3}>
          {/* Weekly */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Weekly report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              A concise overview of your spending activity from the last 7 days,
              delivered on the weekday you choose.
            </Typography>

            <ReminderCard
              type="weekly"
              rem={weeklyReminder}
              onSave={handleSaveReminder}
            />
          </Box>

          <Divider />

          {/* Monthly */}
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Monthly report
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              A broader summary covering your spending from the previous 30 days,
              sent once per month on a selected day.
            </Typography>

            <ReminderCard
              type="monthly"
              rem={monthlyReminder}
              onSave={handleSaveReminder}
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
