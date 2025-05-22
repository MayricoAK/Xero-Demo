import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/components/InvoiceStatusBadge";
import { InvoiceTypeBadge } from "@/components/InvoiceTypeBadge";
import { useXero } from "@/hooks/useXero";
import { formatCurrency, formatDate } from "@/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

export function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, fetchInvoiceById } = useXero();
  const [invoice, setInvoice] = useState(null);

  const fetchInvoice = async () => {
    try {
      const data = await fetchInvoiceById(id);
      console.log("Fetched invoice data:", data);
      setInvoice(data);
    } catch (err) {
      console.error("Failed to fetch invoice:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const renderContactInfo = () => (
    <div>
      <h3 className="font-medium text-gray-500 mb-2">Contact</h3>
      <p className="font-semibold">{invoice.contact?.name}</p>
      {invoice.contact?.addresses?.[0] && (
        <div className="mt-2 text-sm">
          <p>{invoice.contact.addresses[0].addressLine1}</p>
          {invoice.contact.addresses[0].addressLine2 && (
            <p>{invoice.contact.addresses[0].addressLine2}</p>
          )}
          <p>
            {invoice.contact.addresses[0].city},{" "}
            {invoice.contact.addresses[0].region}{" "}
            {invoice.contact.addresses[0].postalCode}
          </p>
          <p>{invoice.contact.addresses[0].country}</p>
        </div>
      )}
    </div>
  );

  const renderInvoiceDetails = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium text-gray-500 mb-2">Invoice Date</h3>
        <p>{formatDate(invoice.date)}</p>
      </div>
      <div>
        <h3 className="font-medium text-gray-500 mb-2">Due Date</h3>
        <p>{formatDate(invoice.dueDate)}</p>
      </div>
      <div>
        <h3 className="font-medium text-gray-500 mb-2">Reference</h3>
        <p>{invoice.reference || "N/A"}</p>
      </div>
      <div>
        <h3 className="font-medium text-gray-500 mb-2">Currency</h3>
        <p>{invoice.currencyCode}</p>
      </div>
    </div>
  );

  const renderLineItems = () => (
    <div className="mt-8">
      <h3 className="font-medium text-gray-500 mb-4">Line Items</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Tax Amount</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description || "No description"}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.unitAmount, invoice.currencyCode)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(item.taxAmount || 0, invoice.currencyCode)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.lineAmount, invoice.currencyCode)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderTotals = () => (
    <div className="mt-6 flex justify-end">
      <div className="w-full max-w-xs space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{formatCurrency(invoice.subTotal, invoice.currencyCode)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>
            {formatCurrency(invoice.totalTax || 0, invoice.currencyCode)}
          </span>
        </div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total</span>
          <span>{formatCurrency(invoice.total, invoice.currencyCode)}</span>
        </div>
        {invoice.amountDue > 0 && (
          <div className="flex justify-between text-red-600 font-semibold">
            <span>Amount Due</span>
            <span>
              {formatCurrency(invoice.amountDue, invoice.currencyCode)}
            </span>
          </div>
        )}
        {invoice.amountPaid > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Amount Paid</span>
            <span>
              {formatCurrency(invoice.amountPaid, invoice.currencyCode)}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCardContent = () => {
    if (isLoading) {
      return (
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              <p className="text-gray-500">Loading invoice details...</p>
            </div>
          </div>
        </CardContent>
      );
    }

    if (error) {
      return (
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={fetchInvoice} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      );
    }

    if (!invoice) {
      return (
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Invoice not found</p>
            <Button variant="outline" onClick={() => navigate("/invoices")}>
              Return to Invoice List
            </Button>
          </div>
        </CardContent>
      );
    }

    // Invoice data loaded successfully
    return (
      <>
        <CardHeader className="border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Invoice #
                {invoice.invoiceNumber || invoice.invoiceID.substring(0, 8)}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <InvoiceStatusBadge status={invoice.status} />
                <InvoiceTypeBadge type={invoice.type} />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderContactInfo()}
            {renderInvoiceDetails()}
          </div>
          {renderLineItems()}
          {renderTotals()}
        </CardContent>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Invoices
      </Button>

      <Card className="shadow-sm">{renderCardContent()}</Card>
    </div>
  );
}
