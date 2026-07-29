import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Active", value: 68 },
  { name: "Trial", value: 18 },
  { name: "Past Due", value: 8 },
  { name: "Cancelled", value: 6 },
];

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
];

function SubscriptionChart() {

  return (

    <div className="dashboard-widget">

      <div className="widget-header">

        <div>

          <h5>

            Subscription Status

          </h5>

          <p>

            Distribution of all subscriptions

          </p>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >

        <PieChart>

          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            paddingAngle={3}
          >

            {

              data.map((entry,index)=>(

                <Cell

                  key={index}

                  fill={COLORS[index]}

                />

              ))

            }

          </Pie>

          <Tooltip/>

          <Legend/>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default SubscriptionChart;