function PlanCard({ plan }) {

    const isPopular = plan.name?.toLowerCase() === "premium";

    return (

        <div className={`pricing-card ${isPopular ? "popular-plan" : ""}`}>

            {isPopular && (

                <div className="popular-badge">

                    ⭐ Most Popular

                </div>

            )}

            <div className="pricing-header">

                <div className="pricing-icon">

                    <i
                        className={`bi ${
                            plan.name?.toLowerCase() === "starter"
                                ? "bi-box"
                                : plan.name?.toLowerCase() === "premium"
                                ? "bi-stars"
                                : "bi-building"
                        }`}
                    ></i>

                </div>

                <h3>{plan.name}</h3>

            </div>

            <div className="pricing-price">

                <span className="currency">₹</span>

                <span className="amount">

                    {Number(plan.price).toFixed(0)}

                </span>

                <span className="interval">

                    / {plan.interval}

                </span>

            </div>
<div className="pricing-divider"></div>

<div className="plan-description">

    <h6>

        Plan Description

    </h6>

    <p>

        {plan.description || "No description available."}

    </p>

</div>

            <div className="mt-auto">

                <button
                    className={`btn w-100 ${
                        isPopular
                            ? "btn-primary"
                            : "btn-outline-primary"
                    }`}
                    onClick={() =>
                        alert("Subscription module coming soon!")
                    }
                >

                    <i className="bi bi-arrow-right-circle me-2"></i>

                    Choose Plan

                </button>

            </div>

        </div>

    );

}

export default PlanCard;