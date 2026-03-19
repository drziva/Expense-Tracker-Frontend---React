import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useMemo } from "react";

type Props = {
  open: boolean;
  title: string;
  action: string;
  description: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  loading = false,
  action,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Dialog 
      open={open}
      onClose={onCancel}
      sx={{
        "& .MuiDialog-paper":{
          borderRadius:"10px",
          padding: "15px",
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          data-cy="confirm-delete-button"
        >
          {action}
        </Button>
        <Button 
          variant="contained" 
          onClick={onCancel}
          color="inherit"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
