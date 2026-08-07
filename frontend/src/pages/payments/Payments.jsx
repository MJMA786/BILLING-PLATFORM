import { useEffect, useMemo, useState } from "react";
import Layout from "../../components/Layout";
import paymentService from "../../services/paymentService";
import { formatCurrency } from "../../utils/formatters";

import {
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Wallet,
} from "lucide-react";

import PaymentTable from "../payments/PaymentTable";
import PaymentViewModal from "../payments/PaymentViewModal";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAll();
      setPayments(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const search = searchTerm.toLowerCase();

      const invNum = String(
        payment.invoice?.invoice_number ||
        payment.invoice_number ||
        (typeof payment.invoice === "string" ? payment.invoice : "") ||
        ""
      );

      const gwRef = String(payment.gateway_reference || "");

      const matchesSearch =
        invNum.toLowerCase().includes(search) ||
        gwRef.toLowerCase().includes(search);

      const pStatus = String(payment.status || "").toLowerCase();
      const matchesStatus =
        statusFilter === "All" ||
        pStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const successfulPayments = payments.filter(
    (p) => String(p.status || "").toLowerCase() === "succeeded" || String(p.status || "").toLowerCase() === "paid"
  );

  const failedPayments = payments.filter(
    (p) => String(p.status || "").toLowerCase() === "failed"
  );

  const pendingPayments = payments.filter(
    (p) => String(p.status || "").toLowerCase() === "pending"
  );

  const totalRevenue = successfulPayments.reduce(
    (total, p) => total + Number(p.amount || 0),
    0
  );

  return (
    <Layout>
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Payments</h2>
            <p className="text-muted mb-0">
              Manage and monitor all customer payments and revenue.
            </p>
          </div>
          <div className="text-end">
            <small className="text-muted">Total Records</small>
            <h5 className="fw-bold mb-0">{payments.length} Payments</h5>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Statistics */}
        <div className="row g-4 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body d-flex align-items-center">
                <div className="bg-success-subtle text-success rounded-3 p-3 me-3">
                  <Wallet size={25} />
                </div>
                <div>
                  <p className="text-muted mb-1">Total Revenue</p>
                  <h4 className="fw-bold mb-0">{formatCurrency(totalRevenue)}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body d-flex align-items-center">

                <div className="bg-primary-subtle text-primary rounded-3 p-3 me-3">

                  <CheckCircle2 size={25} />

                </div>

                <div>

                  <p className="text-muted mb-1">

                    Successful

                  </p>

                  <h4 className="fw-bold mb-0">

                    {successfulPayments.length}

                  </h4>

                </div>

              </div>

            </div>

          </div>

          <div className="col-xl-3 col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body d-flex align-items-center">

                <div className="bg-warning-subtle text-warning rounded-3 p-3 me-3">

                  <Clock size={25} />

                </div>

                <div>

                  <p className="text-muted mb-1">

                    Pending

                  </p>

                  <h4 className="fw-bold mb-0">

                    {pendingPayments.length}

                  </h4>

                </div>

              </div>

            </div>

          </div>

          <div className="col-xl-3 col-md-6">

            <div className="card border-0 shadow-sm rounded-4 h-100">

              <div className="card-body d-flex align-items-center">

                <div className="bg-danger-subtle text-danger rounded-3 p-3 me-3">

                  <XCircle size={25} />

                </div>

                <div>

                  <p className="text-muted mb-1">

                    Failed

                  </p>

                  <h4 className="fw-bold mb-0">

                    {failedPayments.length}

                  </h4>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Search */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body">

            <div className="row g-3">

              <div className="col-lg-8">

                <div className="input-group">

                  <span className="input-group-text bg-white border-end-0">

                    <Search size={18} />

                  </span>

                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search Invoice Number or Gateway Reference..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="col-lg-4">

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="All">

                    All Status

                  </option>

                  <option value="succeeded">

                    Succeeded

                  </option>

                  <option value="pending">

                    Pending

                  </option>

                  <option value="failed">

                    Failed

                  </option>

                  <option value="refunded">

                    Refunded

                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* Table */}

        <PaymentTable

          payments={filteredPayments}

          loading={loading}

          onRefresh={fetchPayments}

          onView={(payment) =>
            setSelectedPayment(payment)
          }

        />

        {/* View Modal */}

        <PaymentViewModal

          payment={selectedPayment}

          show={selectedPayment !== null}

          onClose={() =>
            setSelectedPayment(null)
          }

        />

      </div>

    </Layout>

  );

}

export default Payments;