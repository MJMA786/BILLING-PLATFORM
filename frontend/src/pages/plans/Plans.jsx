import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import PlanTable from "../../components/plans/PlanTable";
import PlanForm from "../../components/plans/PlanForm";
import CustomerStatCard from "../../components/customers/CustomerStatCard";
import planService from "../../services/planService";
import { useToast } from "../../context/ToastContext";

function Plans() {
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ======================================================
  // Load Plans
  // ======================================================

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const data = await planService.getAllPlans();

      setPlans(data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ======================================================
  // Create / Update Plan
  // ======================================================

  const handleSavePlan = async (planData) => {
    try {
      if (selectedPlan) {
        await planService.updatePlan(
          selectedPlan.id,
          planData
        );

        showToast(
          "Plan updated successfully!",
          "success"
        );
      } else {
        await planService.createPlan(planData);

        showToast(
          "New subscription plan created successfully!",
          "success"
        );
      }

      setShowModal(false);
      setSelectedPlan(null);

      fetchPlans();
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      let message = "Failed to save plan.";

      if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg)
          .join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      }

      showToast(message, "danger");
    }
  };

  // ======================================================
  // Deactivate Plan
  // ======================================================

  const handleDeactivate = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this plan?"
      )
    ) {
      return;
    }

    try {
      await planService.deactivatePlan(id);

      showToast(
        "Plan deactivated successfully.",
        "warning"
      );

      fetchPlans();
    } catch (err) {
      console.error(err);

      showToast(
        err.response?.data?.detail ||
          "Failed to deactivate plan.",
        "danger"
      );
    }
  };

  // ======================================================
  // Activate Plan
  // ======================================================

  const handleActivate = async (id) => {
    try {
      await planService.updatePlan(id, {
        is_active: true,
      });

      showToast(
        "Plan activated successfully!",
        "success"
      );

      fetchPlans();
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      let message = "Failed to activate plan.";

      if (Array.isArray(detail)) {
        message = detail
          .map((item) => item.msg)
          .join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      }

      showToast(message, "danger");
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Plan Management
            </h2>

            <p className="text-muted mb-0">
              Configure tiered subscription pricing
              and feature packages.
            </p>
          </div>

          <button
            className="btn btn-primary rounded-3 px-4 fw-semibold"
            onClick={() => {
              setSelectedPlan(null);
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>
            New Plan
          </button>
        </div>

        {/* Statistics */}

        <div className="row g-3 mb-4">

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Total Plans"
              value={plans.length}
              subtitle="Configured plans"
              icon="bi-box-seam-fill"
              color="primary"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Active Plans"
              value={
                plans.filter(
                  (p) => p.is_active
                ).length
              }
              subtitle="Available for purchase"
              icon="bi-check-circle-fill"
              color="success"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Monthly Tier"
              value={
                plans.filter(
                  (p) =>
                    p.billing_interval ===
                    "monthly"
                ).length
              }
              subtitle="Monthly billing"
              icon="bi-calendar-month-fill"
              color="warning"
            />
          </div>

          <div className="col-xl-3 col-md-6">
            <CustomerStatCard
              title="Annual Tier"
              value={
                plans.filter(
                  (p) =>
                    p.billing_interval ===
                    "annual"
                ).length
              }
              subtitle="Annual billing"
              icon="bi-stars"
              color="danger"
            />
          </div>

        </div>

        {/* Loading */}

        {loading && (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Table */}

        {!loading && !error && (
          <PlanTable
            plans={plans}
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setShowModal(true);
            }}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
          />
        )}

        {/* Modal */}

        <PlanForm
          show={showModal}
          plan={selectedPlan}
          onClose={() => {
            setShowModal(false);
            setSelectedPlan(null);
          }}
          onSave={handleSavePlan}
        />

      </div>
    </Layout>
  );
}

export default Plans;