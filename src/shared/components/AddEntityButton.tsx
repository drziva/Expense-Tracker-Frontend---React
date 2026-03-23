import { Button } from "@mui/material";

type Props = {
    onClick: () => void;
    disabled?: boolean;
    title: string;
}

export default function AddEntityButton({ onClick, disabled, title }: Props) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            variant="contained"
            sx={{
                height: 40,
                fontSize: "0.8rem",
                lineHeight: "1.3",
                whiteSpace: "nowrap",
            }}
            >
            <strong>{title}</strong>
        </Button>
    )
}