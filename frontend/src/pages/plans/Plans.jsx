import { useEffect, useState } from "react";

import Layout from "../../components/Layout";
import PlanTable from "../../components/plans/PlanTable";
import PlanForm from "../../components/plans/PlanForm";

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

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2>Plans</h2>

          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedPlan(null);
              setShowModal(true);
            }}
          >
            + Add Plan
          </button>

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
          <PlanTable
            plans={plans}
            onEdit={(plan) => {
              setSelectedPlan(plan);
              setShowModal(true);
            }}
            onDeactivate={handleDeactivate}
          />
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