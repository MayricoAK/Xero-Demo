import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useXero } from "@/hooks/useXero";
import { TableData } from "../TableData";
import { InvoiceColumns } from "@/utils/columnData";

export function SalesInvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const { isLoading, error, fetchInvoices } = useXero();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const filters = { type: "ACCREC" };
        if (filterStatus !== "all") {
          filters.status = filterStatus;
        }

        const data = await fetchInvoices(filters);
        console.log("Received sales invoices:", data);
        setInvoices(data);
      } catch (err) {
        console.error("Failed to fetch invoices in component:", err);
      }
    };

    loadInvoices();
  }, [filterStatus]);

  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/${invoice.invoiceID}`);
  };

  const handleRetry = () => {
    const filters = { type: "ACCREC" };
    if (filterStatus !== "all") filters.status = filterStatus;
    fetchInvoices(filters).then((data) => setInvoices(data));
  };

  const handleSelectionChange = (selectedItems, selectedMap) => {
    console.log("Selected invoices:", selectedItems);
    console.log("Selection map:", selectedMap);
  };

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
        <TableData
          data={invoices}
          columns={InvoiceColumns}
          selectable={true}
          rowIdKey="invoiceID"
          onRowClick={handleViewInvoice}
          onSelectionChange={handleSelectionChange}
          loading={isLoading}
          error={error}
          emptyMessage="No invoices found."
          onRetry={handleRetry}
        />
      </CardContent>
    </Card>
  );
}
