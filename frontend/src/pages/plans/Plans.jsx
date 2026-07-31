import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import PlanTable from "../../components/plans/PlanTable";
import PlanForm from "../../components/plans/PlanForm";
import CustomerStatCard from "../../components/customers/CustomerStatCard";
import planService from "../../services/planService";


function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const data = await planService.getAllPlans();

      console.log("Plans:", data);

      setPlans(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSavePlan = async (planData) => {
    try {
      if (selectedPlan) {
        await planService.updatePlan(
          selectedPlan.id,
          planData
        );
      } else {
        await planService.createPlan(planData);
      }

      setShowModal(false);
      setSelectedPlan(null);

      fetchPlans();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.detail ||
        "Failed to save plan."
      );
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm("Deactivate this plan?")) {
      return;
    }

    try {
      await planService.deactivatePlan(id);

      fetchPlans();
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate plan.");
    }
  };

  return (
    <Layout>
      <div className="container-fluid">

<div className="customers-header">

    <div>

        <span className="dashboard-tag">

            Plan Management

        </span>

        <h1>

            Plans

        </h1>

        <p>

            Create and manage subscription plans.

        </p>

    </div>

    <button

        className="btn btn-primary"

        onClick={() => {

            setSelectedPlan(null);

            setShowModal(true);

        }}

    >

        <i className="bi bi-plus-circle-fill me-2"></i>

        New Plan

    </button>

</div>
<div className="row g-3 mb-4">

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Total Plans"

            value={plans.length}

            subtitle="Available"

            icon="bi-box-seam-fill"

            color="primary"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Active"

            value={

                plans.filter(

                    p => p.active

                ).length

            }

            subtitle="Running"

            icon="bi-check-circle-fill"

            color="success"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Monthly"

            value={

                plans.filter(

                    p => p.interval === "monthly"

                ).length

            }

            subtitle="Billing"

            icon="bi-calendar-month-fill"

            color="warning"

        />

    </div>

    <div className="col-xl-3 col-md-6">

        <CustomerStatCard

            title="Annual"

            value={

                plans.filter(

                    p => p.interval === "annual"

                ).length

            }

            subtitle="Billing"

            icon="bi-stars"

            color="danger"

        />

    </div>

</div>

        {loading && (
          <div className="text-center">

            <div
              className="spinner-border"
              role="status"
            ></div>

          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="customer-table-card">

    <PlanTable

        plans={plans}

        onEdit={(plan) => {

            setSelectedPlan(plan);

            setShowModal(true);

        }}

        onDeactivate={handleDeactivate}

    />

</div>
        )}

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