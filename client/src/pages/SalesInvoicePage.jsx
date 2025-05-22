import { SalesInvoiceList } from "@/components/invoices/SalesInvoiceList";

const SalesInvoicePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Sales Invoice</h1>
      <SalesInvoiceList />
    </div>
  );
};

export default SalesInvoicePage;
