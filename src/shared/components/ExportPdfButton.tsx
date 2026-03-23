import { Button } from "@mui/material";

type Props = {
    onClick: () => void;
    disabled?: boolean;
}

export default function ExportPdfButton({ onClick, disabled = false }: Props) {
    return (
        <Button
            variant="outlined"
            onClick={onClick}
            sx={{
                height: 40,
                fontSize: "0.8rem",
                whiteSpace: "nowrap",
            }}
            disabled={disabled}
            >
            Export PDF
        </Button>
    )
}