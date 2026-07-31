import { useEffect, useState } from "react";
import PlanCard from "../../components/customers/PlanCard";
import planService from "../../services/planService";

function CustomerPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const data = await planService.getAvailablePlans();

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

  return (

      <div className="container-fluid">
<div className="plans-header">

    <div>

        <span className="customer-tag">

            Pricing Plans

        </span>

        <h1>

            Choose Your Perfect Plan

        </h1>

        <p>

            Upgrade or switch your subscription anytime.

        </p>

    </div>

    <div className="plans-count">

        <i className="bi bi-grid-3x3-gap-fill me-2"></i>

        {plans.length} Active Plans

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

          <div className="row g-4 mt-2">

            {plans.map((plan) => (

              <div
                className="col-lg-4 mb-4"
                key={plan.id}
              >
                <PlanCard plan={plan} />
              </div>

            ))}

          </div>

        )}

      </div>
  );
}

export default CustomerPlans;