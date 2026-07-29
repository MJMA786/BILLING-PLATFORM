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

        <h2 className="mb-4">
          Available Plans
        </h2>

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

          <div className="row">

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