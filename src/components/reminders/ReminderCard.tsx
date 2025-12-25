import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { ReminderResponse } from "../../types/reminders.responses";

type ReminderType = "weekly" | "monthly";

type Props = {
  type: ReminderType;
  rem: ReminderResponse | null;
  onSave: (payload: {
    type: ReminderType;
    active: boolean;
    weekday?: number;
    dayOfMonth?: number;
  }) => void;
};

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function ReminderCard({ type, rem, onSave }: Props) {
  const [active, setActive] = useState(rem?.active ?? false);
  const [weekday, setWeekday] = useState(rem?.weekday ?? 1);
  const [dayOfMonth, setDayOfMonth] = useState(rem?.dayOfMonth ?? 1);

  useEffect(() => {
    if (!rem) return;
    setActive(rem.active);
    setWeekday(rem.weekday ?? 1);
    setDayOfMonth(rem.dayOfMonth ?? 1);
  }, [rem]);

  useEffect(() => {
    const timeout = setTimeout(()=>{
      onSave({
        type,
        active,
        ...(type === "weekly"
          ? { weekday }
          : { dayOfMonth }),
      });
    },2000)
    return() => clearTimeout(timeout);
  },[active])


  
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Paper sx={{ p: 2 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="subtitle2">
              {type === "weekly" ? "Weekday" : "Day of month"}
            </Typography>

            {type === "weekly" && (
              <Select
                size="small"
                value={weekday}
                onChange={(e) => setWeekday(Number(e.target.value))}
                disabled={active}
              >
                {WEEKDAYS.map((label, i) => (
                  <MenuItem key={i} value={i}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            )}

            {type === "monthly" && (
              <Select
                size="small"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(Number(e.target.value))}
                disabled={active}
                sx={{
                  maxHeight: 200
                }}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>

          <Switch
            checked={active}
            onChange={() => {setActive(prev=>!prev);}}
          />
        </Box>
      </Paper>
    </Box>
  );
}
