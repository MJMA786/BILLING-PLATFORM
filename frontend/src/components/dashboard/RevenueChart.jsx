import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 24000 },
  { month: "Apr", revenue: 21000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 34000 },
  { month: "Jul", revenue: 41000 },
];

function RevenueChart() {
  return (
    <div className="dashboard-widget">

      <div className="widget-header">

        <div>

          <h5>Revenue Overview</h5>

          <p>Monthly revenue analytics</p>

        </div>

        <span className="trend-badge">

          <i className="bi bi-graph-up-arrow me-1"></i>

          +18%

        </span>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <AreaChart data={revenueData}>

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
          />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563EB"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>
  );
}

export default RevenueChart;