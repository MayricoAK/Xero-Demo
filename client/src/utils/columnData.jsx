import { InvoiceTypeBadge } from "@/components/InvoiceTypeBadge";
import { formatCurrency, formatDate } from ".";
import { InvoiceStatusBadge } from "@/components/InvoiceStatusBadge";

export const InvoiceColumns = [
  {
    key: "contact",
    header: "Contact",
    cellClassName: "font-medium",
    render: (row) => row.contact?.name || "Unknown Contact",
  },
  {
    key: "invoiceNumber",
    header: "Invoice #",
    render: (row) => row.invoiceNumber || row.invoiceID.substring(0, 8),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
  },
  {
    key: "dueDate",
    header: "Due Date",
    render: (row) => (row.dueDate ? formatDate(row.dueDate) : "-"),
  },
  {
    key: "type",
    header: "Type",
    render: (row) => <InvoiceTypeBadge type={row.type} />,
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <InvoiceStatusBadge status={row.status} />,
  },
  {
    key: "reference",
    header: "Reference",
    render: (row) => row.reference || "-",
  },
  {
    key: "total",
    header: "Total",
    cellClassName: "text-right font-medium",
    render: (row) => formatCurrency(row.total, row.currencyCode),
  },
  {
    key: "amountDue",
    header: "Due",
    cellClassName: "text-right",
    render: (row) => formatCurrency(row.amountDue, row.currencyCode),
  },
  {
    key: "amountPaid",
    header: "Paid",
    cellClassName: "text-right text-green-600",
    render: (row) =>
      row.amountPaid > 0
        ? formatCurrency(row.amountPaid, row.currencyCode)
        : "-",
  },
];
