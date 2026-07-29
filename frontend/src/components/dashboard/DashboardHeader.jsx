import { useMemo } from "react";

function DashboardHeader() {

    const today = useMemo(() => {

        return new Date().toLocaleDateString("en-IN", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric",

        });

    }, []);

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 17) {

        greeting = "Good Afternoon";

    }

    return (

        <div className="dashboard-header">

            <div>

                <span className="dashboard-tag">

                    Admin Dashboard

                </span>

                <h1>

                    {greeting} Admin, Welcome Back!

                </h1>

                <p>

                    Here's what's happening with your billing platform today.

                </p>

            </div>

            <div className="dashboard-actions">

                <div className="dashboard-date">

                    <i className="bi bi-calendar3 me-2"></i>

                    {today}

                </div>

            </div>

        </div>

    );

}

export default DashboardHeader;