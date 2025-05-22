import { InvoiceList } from "@/components/invoices/InvoiceList";

const HomePage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <InvoiceList />
    </div>
  );
};

export default HomePage;
