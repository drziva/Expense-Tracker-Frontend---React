import { Popover, Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  selector: string;
  text: string;
};

export default function OnboardingTooltip({ selector, text }: Props) {

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {

    const el = document.querySelector(selector) as HTMLElement | null;

    if (el) setAnchorEl(el);

  }, [selector]);


  if (!anchorEl) return null;


  return (

    <Popover
      open
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      PaperProps={{
        sx: {

          backgroundColor: "transparent", // remove MUI solid bg
          boxShadow: "none"

        }
      }}
    >

      <Box
        sx={{

          p: 2,
          maxWidth: 280,
          borderRadius: 3,

          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",

          background: "rgba(30, 30, 40, 0.35)",

          border: "1px solid rgba(255,255,255,0.08)",

          boxShadow: "0 20px 80px rgba(0,0,0,0.45)",

          color: "white"

        }}
      >

        <Typography fontSize={14} lineHeight={1.5}>
          {text}
        </Typography>

      </Box>

    </Popover>

  );

}