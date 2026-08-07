import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import billingCycleService from "../../services/billingCycleService";

import BillingCycleTable from "../../components/billing-cycles/BillingCycleTable";
import BillingCycleStatCard from "../../components/billing-cycles/BillingCycleStatCard";
import BillingCycleViewModal from "../../components/billing-cycles/BillingCycleViewModal";

function BillingCycles() {

  const [billingCycles, setBillingCycles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedCycle, setSelectedCycle] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);

  const fetchBillingCycles = async () => {

    try {

      setLoading(true);

      const data =
        await billingCycleService.getAll();

      setBillingCycles(data);

      setError("");

    }

    catch (err) {

      console.error(err);

      setError(
        "Failed to load billing cycles."
      );

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchBillingCycles();

  }, []);

  const handleView = (cycle) => {

    setSelectedCycle(cycle);

    setShowViewModal(true);

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

              Billing Cycles

            </h1>

            <p>

              Manage all billing cycles generated
              in the platform.

            </p>

          </div>

        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">

          <div className="col-xl-3 col-md-6">

            <BillingCycleStatCard

              title="Total"

              value={billingCycles.length}

              subtitle="Billing Cycles"

              icon="bi-receipt"

              color="primary"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <BillingCycleStatCard

              title="Pending"

              value={
                billingCycles.filter(
                  c => c.status === "pending"
                ).length
              }

              subtitle="Awaiting Invoice"

              icon="bi-clock-history"

              color="warning"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <BillingCycleStatCard

              title="Invoiced"

              value={
                billingCycles.filter(
                  c => c.status === "invoiced"
                ).length
              }

              subtitle="Invoices Generated"

              icon="bi-credit-card"

              color="success"

            />

          </div>

          <div className="col-xl-3 col-md-6">

            <BillingCycleStatCard

              title="Completed"

              value={
                billingCycles.filter(
                  c => c.status === "completed"
                ).length
              }

              subtitle="Finished"

              icon="bi-check-circle"

              color="info"

            />

          </div>

        </div>

        {/* Loading */}

        {loading && (

          <div className="text-center">

            <div
              className="spinner-border"
              role="status"
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

          <BillingCycleTable

            billingCycles={billingCycles}

            onView={handleView}

          />

        )}

        {/* Modal */}

        <BillingCycleViewModal

          show={showViewModal}

          billingCycle={selectedCycle}

          onClose={() => {

            setShowViewModal(false);

            setSelectedCycle(null);

          }}

        />

      </div>

    </Layout>

  );

}

export default BillingCycles;