import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-lg transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-900">
            {value}
          </h2>

          <p className="text-sm text-green-600 flex items-center gap-1 mt-3">
            <ArrowUpRight size={16} />
            {subtitle}
          </p>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
        >
          <Icon className="text-white" size={28} />
        </div>

      </div>

    </div>
  );
}