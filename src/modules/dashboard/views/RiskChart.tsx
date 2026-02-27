import { PatientStats } from '../../../shared/types/patient';

interface RiskChartProps {
  stats: PatientStats;
}

export function RiskChart({ stats }: RiskChartProps) {
  const maxValue = Math.max(stats.high, stats.medium, stats.low);
  const scale = maxValue > 0 ? 100 / maxValue : 0;

  const categories = [
    { label: 'High Risk', count: stats.high, color: 'bg-red-500', percentage: stats.total > 0 ? (stats.high / stats.total) * 100 : 0 },
    { label: 'Medium Risk', count: stats.medium, color: 'bg-orange-500', percentage: stats.total > 0 ? (stats.medium / stats.total) * 100 : 0 },
    { label: 'Low Risk', count: stats.low, color: 'bg-green-500', percentage: stats.total > 0 ? (stats.low / stats.total) * 100 : 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Distribution</h2>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{category.label}</span>
              <span className="text-sm text-gray-600">
                {category.count} ({category.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className={`${category.color} h-8 rounded-full transition-all duration-500 flex items-center justify-end px-3`}
                style={{ width: `${category.count * scale}%` }}
              >
                {category.count > 0 && (
                  <span className="text-white text-xs font-semibold">{category.count}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
