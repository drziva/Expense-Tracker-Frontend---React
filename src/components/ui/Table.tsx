import { Table as BasicTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}

type TableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
}: TableProps<T>) {
  return (
    <TableContainer
      sx={{
        "& table": {
          borderCollapse: "separate",
          borderSpacing: "0 6px",
        },
      }}
    >
      <BasicTable size="small">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align={col.align ?? "left"}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  borderBottom: "none",
                  pb: 1,
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowKey(row)}
              hover
              onClick={() => onRowClick?.(row)}
              sx={{
                cursor: onRowClick ? "pointer" : "default",
                backgroundColor: "background.paper",
                transition: "background-color 120ms ease",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align ?? "left"}
                  sx={{
                    borderBottom: "none",
                    fontSize: "0.9rem",
                  }}
                >
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </BasicTable>
    </TableContainer>
  );
}
