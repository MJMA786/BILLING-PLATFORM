import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import invoiceService from "../../services/invoiceService";
import InvoiceTable from "../../components/invoices/InvoiceTable";
import InvoiceViewModal from "../../components/invoices/InvoiceViewModal";
import StatCard from "../../components/common/StatCard";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatCurrency } from "../../utils/formatters";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data || []);
      setError("");
    } catch (err) {
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const paidInvoices = invoices.filter((invoice) => invoice.status === "paid");
  const openInvoices = invoices.filter((invoice) => invoice.status === "open");
  const revenue = paidInvoices.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  return (
    <Layout>
      <div className="container-fluid py-2">
        <PageHeader
          tag="Billing Management"
          title="Invoices"
          description="Manage all generated invoices, stream PDFs, send email notifications, and settle payments."
        />

        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Total Invoices"
              value={invoices.length}
              subtitle="Generated total"
              icon="bi-receipt"
              color="primary"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Paid Invoices"
              value={paidInvoices.length}
              subtitle="Settled"
              icon="bi-check-circle-fill"
              color="success"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Open Invoices"
              value={openInvoices.length}
              subtitle="Pending payment"
              icon="bi-clock-history"
              color="warning"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <StatCard
              title="Paid Volume"
              value={formatCurrency(revenue)}
              subtitle="Invoice receipts"
              icon="bi-cash-stack"
              color="info"
            />
          </div>
        </div>

        {loading && <LoadingSpinner />}

        {!loading && error && <div className="alert alert-danger mb-4">{error}</div>}

        {!loading && !error && (
          <InvoiceTable
            invoices={invoices}
            onRefresh={fetchInvoices}
            onView={(invoice) => {
              setSelectedInvoice(invoice);
              setShowModal(true);
            }}
          />
        )}

        <InvoiceViewModal
          show={showModal}
          invoice={selectedInvoice}
          onClose={() => {
            setSelectedInvoice(null);
            setShowModal(false);
          }}
        />
      </div>
    </Layout>
  );
}

export default Invoices;