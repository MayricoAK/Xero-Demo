import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export function TableData({
  data = [],
  columns = [],
  selectable = false,
  onRowClick,
  onSelectionChange,
  loading = false,
  error = null,
  emptyMessage = "No data found.",
  className = "",
  onRetry,
  rowIdKey,
}) {
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  // Handle individual row selection
  const toggleSelectRow = (e, rowId) => {
    e.stopPropagation();
    const newSelectedRows = {
      ...selectedRows,
      [rowId]: !selectedRows[rowId],
    };

    setSelectedRows(newSelectedRows);

    // Check if all rows are selected
    const allSelected = data.every((row) => newSelectedRows[getRowId(row)]);
    setSelectAll(allSelected && data.length > 0);

    // Notify parent component
    if (onSelectionChange) {
      const selectedItems = data.filter(
        (row) => newSelectedRows[getRowId(row)]
      );
      onSelectionChange(selectedItems, newSelectedRows);
    }
  };

  // Handle select all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedRows = {};
    data.forEach((row) => {
      newSelectedRows[getRowId(row)] = newSelectAll;
    });

    setSelectedRows(newSelectedRows);

    if (onSelectionChange) {
      const selectedItems = newSelectAll ? [...data] : [];
      onSelectionChange(selectedItems, newSelectedRows);
    }
  };

  const getRowId = (row) => {
    if (rowIdKey && row[rowIdKey]) {
      return row[rowIdKey];
    }
    return (
      row.id ||
      row.invoiceID ||
      row.contactID ||
      row.uuid ||
      JSON.stringify(row)
    );
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const renderCell = (column, row, rowIndex) => {
    if (column.render) {
      return column.render(row, rowIndex);
    }

    const value = column.key ? row[column.key] : "";
    return value || "-";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-4">
            Retry
          </Button>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Selection indicator */}
      {selectable && selectedCount > 0 && (
        <div className="p-2 px-4 bg-blue-50 border-b">
          <span className="text-blue-700 font-medium">
            {selectedCount} selected
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map((column, index) => (
                <TableHead
                  key={column.key || index}
                  className={`${column.width || ""} ${
                    column.headerClassName || ""
                  }`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => {
              const rowId = getRowId(row);
              return (
                <TableRow
                  key={rowId}
                  className={`${
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  } ${row.className || ""}`}
                  onClick={() => onRowClick && onRowClick(row, rowIndex)}
                >
                  {selectable && (
                    <TableCell
                      className="w-12"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={!!selectedRows[rowId]}
                        onCheckedChange={(e) => toggleSelectRow(e, rowId)}
                        aria-label={`Select row ${rowIndex + 1}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={column.key || colIndex}
                      className={`${column.width || ""} ${
                        column.cellClassName || ""
                      }`}
                    >
                      {renderCell(column, row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
