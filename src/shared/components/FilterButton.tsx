import { Button } from "@mui/material";
import FilterIcon from "@mui/icons-material/FilterList";

export function FilterButton({ onClick }: { onClick: () => void }) {
    return (
        <Button
            variant="outlined"
            color="primary"
            onClick={onClick}
            sx={{ height: 40 }}
        >
            <FilterIcon fontSize="small" />
        </Button>
    )
}