import { useEffect, useState } from "react";

import Layout from "../../components/Layout";

import invoiceService from "../../services/invoiceService";

import InvoiceTable from "../../components/invoices/InvoiceTable";

import InvoiceViewModal from "../../components/invoices/InvoiceViewModal";

import InvoiceStatCard from "../../components/invoices/InvoiceStatCard";

function Invoices() {

  const [invoices, setInvoices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedInvoice, setSelectedInvoice] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const fetchInvoices = async () => {

    try {

      setLoading(true);

      const data =
        await invoiceService.getAll();

      setInvoices(data);

      setError("");

    }

    catch (err) {

      console.error(err);

      setError(
        "Failed to load invoices."
      );

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchInvoices();

  }, []);

  const handleView = (invoice) => {

    setSelectedInvoice(invoice);

    setShowModal(true);

  };

  return (

    <Layout>

      <div className="container-fluid">

        {/* Header */}

        <div className="customers-header">

          <div>

            <span className="dashboard-tag">

              Billing Management

            </span>

            <h1>

              Invoices

            </h1>

            <p>

              Manage all invoices generated
              in the billing platform.

            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">

          <div className="col-xl-3 col-md-6">

            <InvoiceStatCard

              title="Invoices"

              value={invoices.length}

              subtitle="Generated"

              icon="bi-receipt"

              color="primary"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <InvoiceStatCard

              title="Paid"

              value={
                invoices.filter(
                  i => i.status === "paid"
                ).length
              }

              subtitle="Completed"

              icon="bi-check-circle"

              color="success"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <InvoiceStatCard

              title="Open"

              value={
                invoices.filter(
                  i => i.status === "open"
                ).length
              }

              subtitle="Awaiting Payment"

              icon="bi-clock-history"

              color="warning"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <InvoiceStatCard

              title="Draft"

              value={
                invoices.filter(
                  i => i.status === "draft"
                ).length
              }

              subtitle="Pending"

              icon="bi-file-earmark"

              color="secondary"

            />

          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div className="text-center">

            <div
              className="spinner-border"
            ></div>

          </div>

        )}

        {/* Error */}

        {error && (

          <div className="alert alert-danger">

            {error}

          </div>

        )}

        {/* Table */}

        {!loading && !error && (

          <InvoiceTable
            invoices={invoices}
            onView={handleView}
            onRefresh={fetchInvoices}
            showAdminActions={true}
          />

        )}

        {/* View */}

        <InvoiceViewModal

          show={showModal}

          invoice={selectedInvoice}

          onClose={() => {

            setShowModal(false);

            setSelectedInvoice(null);

          }}

        />

      </div>

    </Layout>

  );

}

export default Invoices;