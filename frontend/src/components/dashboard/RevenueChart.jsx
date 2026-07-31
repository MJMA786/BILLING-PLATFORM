import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function RevenueChart({ data = [] }) {

  return (

    <div className="dashboard-widget">

      <div className="widget-header">

        <div>

          <h5>Revenue Overview</h5>

          <p>Monthly revenue analytics</p>

        </div>

        <span className="trend-badge">

          <i className="bi bi-graph-up-arrow me-1"></i>

          Revenue

        </span>

      </div>

      {data.length === 0 ? (

        <div className="empty-state">

          <i className="bi bi-bar-chart-line fs-1"></i>

          <p>No revenue data available.</p>

        </div>

      ) : (

        <ResponsiveContainer width="100%" height={320}>

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="colorRevenue"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,.12)",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              animationDuration={1200}
            />

          </AreaChart>

        </ResponsiveContainer>

      )}

    </div>

  );

}

export default RevenueChart;