import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function SubscriptionChart({ data = [] }) {

  const totalSubscriptions = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (

    <div className="dashboard-widget">

      <div className="widget-header">

        <div>

          <h5>Subscription Status</h5>

          <p>Current subscription distribution</p>

        </div>

        <span className="trend-badge">

          <i className="bi bi-pie-chart-fill me-1"></i>

          {totalSubscriptions}

        </span>

      </div>

      {data.length === 0 ? (

        <div className="empty-state">

          <i className="bi bi-pie-chart fs-1"></i>

          <p>No subscription data available.</p>

        </div>

      ) : (

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={4}
              animationDuration={1200}
            >

              {data.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))}

            </Pie>

            <Tooltip
              formatter={(value) => [
                value,
                "Subscriptions",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.12)",
              }}
            />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      )}

    </div>

  );

}

export default SubscriptionChart;