import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}

type GenericTableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export function GenericTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
}: GenericTableProps<T>) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col.key}
                align={col.align ?? "left"}
                sx={{ fontWeight: 700 }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map(row => (
            <TableRow
              key={getRowKey(row)}
              hover
              sx={{ cursor: onRowClick ? "pointer" : "default" }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map(col => (
                <TableCell key={col.key} align={col.align ?? "left"}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
