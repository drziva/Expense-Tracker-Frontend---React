import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  action: string;
  onClose: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  children: ReactNode;
}

export function FormDialog({
  open,
  title,
  action,
  onClose,
  onSubmit,
  submitting,
  children
}: Props) {
  const isMobile = useMediaQuery("(max-width: 600px)")

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper":{
          borderRadius:"10px",
          padding: isMobile ? "0px" : "25px",
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>{children}</DialogContent>

      <DialogActions>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={submitting}
        >
          {action}
        </Button>
        <Button 
          onClick={onClose}
          variant="contained"
          color="inherit"  
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}