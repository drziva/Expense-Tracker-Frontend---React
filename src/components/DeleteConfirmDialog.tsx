import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmDialog({
  open,
  title,
  description,
  loading = false,
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
          Are you sure you want to delete{" "}
          <strong>{description}</strong>?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          Delete
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
