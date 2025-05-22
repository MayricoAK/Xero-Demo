import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceTypeBadge } from "../InvoiceTypeBadge";
import { InvoiceStatusBadge } from "../InvoiceStatusBadge";
import { formatCurrency, formatDate } from "@/utils";
import { useXero } from "@/hooks/useXero";

export function SalesInvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInvoices, setSelectedInvoices] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const { isLoading, error, fetchInvoices } = useXero();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const filters = {};

        filters.type = "ACCREC";

        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }

        const data = await fetchInvoices(filters);
        console.log("Received sales invoices:", data);
        setInvoices(data);
        // Reset selection when invoices change
        setSelectedInvoices({});
        setSelectAll(false);
      } catch (err) {
        console.error("Failed to fetch invoices in component:", err);
      }
    };

    loadInvoices();
  }, [filterStatus]);

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleRetry = () => {
    const filters = {};
    if (filterStatus !== "all") filters.status = filterStatus;

    fetchInvoices(filters).then((data) => setInvoices(data));
  };

  // Select handling
  const toggleSelectInvoice = (e, invoiceId) => {
    setSelectedInvoices((prev) => ({
      ...prev,
      [invoiceId]: !prev[invoiceId],
    }));

    const updatedSelection = {
      ...selectedInvoices,
      [invoiceId]: !selectedInvoices[invoiceId],
    };

    const allSelected = invoices.every(
      (invoice) => updatedSelection[invoice.invoiceID]
    );

    setSelectAll(allSelected && invoices.length > 0);
  };

  const toggleSelectAll = (e) => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedInvoices = { ...selectedInvoices };
    invoices.forEach((invoice) => {
      newSelectedInvoices[invoice.invoiceID] = newSelectAll;
    });

    setSelectedInvoices(newSelectedInvoices);
  };

  // Get selected invoices count
  const selectedCount = Object.values(selectedInvoices).filter(Boolean).length;

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-64">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="AUTHORISED">Authorised</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                  <SelectItem value="VOIDED">Voided</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <p className="text-gray-500">Loading invoices...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={handleRetry} className="mt-4">
              Retry
            </Button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No invoices found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {selectedCount > 0 && (
                <div className="p-2 px-4 bg-blue-50 border-b">
                  <span className="text-blue-700 font-medium">
                    {selectedCount} selected
                  </span>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all invoices"
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Due</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow
                      key={invoice.invoiceID}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewInvoice(invoice.invoiceID)}
                    >
                      <TableCell
                        className="w-12"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={!!selectedInvoices[invoice.invoiceID]}
                          onCheckedChange={(e) =>
                            toggleSelectInvoice(e, invoice.invoiceID)
                          }
                          aria-label={`Select invoice ${
                            invoice.invoiceNumber || invoice.invoiceID
                          }`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.contact?.name || "Unknown Contact"}
                      </TableCell>
                      <TableCell>
                        {invoice.invoiceNumber ||
                          invoice.invoiceID.substring(0, 8)}
                      </TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>
                        {invoice.dueDate ? formatDate(invoice.dueDate) : "-"}
                      </TableCell>
                      <TableCell>
                        <InvoiceTypeBadge type={invoice.type} />
                      </TableCell>
                      <TableCell>
                        <InvoiceStatusBadge status={invoice.status} />
                      </TableCell>
                      <TableCell>{invoice.reference || "-"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(invoice.total, invoice.currencyCode)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          invoice.amountDue,
                          invoice.currencyCode
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {invoice.amountPaid > 0
                          ? formatCurrency(
                              invoice.amountPaid,
                              invoice.currencyCode
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
