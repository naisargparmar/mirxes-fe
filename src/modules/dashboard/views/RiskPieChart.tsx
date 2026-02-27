import { PatientStats } from '../../../shared/types/patient';

interface RiskPieChartProps {
  stats: PatientStats;
}

export function RiskPieChart({ stats }: RiskPieChartProps) {
  const total = stats.total || 1;
  const highPercent = (stats.high / total) * 100;
  const mediumPercent = (stats.medium / total) * 100;
  const lowPercent = (stats.low / total) * 100;

  const highAngle = (highPercent / 100) * 360;
  const mediumAngle = (mediumPercent / 100) * 360;

  const createSlice = (startAngle: number, sliceAngle: number, color: string, label: string, count: number, percent: number) => {
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (sliceAngle / 360) * circumference;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = ((startAngle + sliceAngle) * Math.PI) / 180;

    const x1 = 150 + radius * Math.cos(startRad);
    const y1 = 150 + radius * Math.sin(startRad);
    const x2 = 150 + radius * Math.cos(endRad);
    const y2 = 150 + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData = [
      `M 150 150`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ');

    const labelAngle = startAngle + sliceAngle / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelRadius = 65;
    const labelX = 150 + labelRadius * Math.cos(labelRad);
    const labelY = 150 + labelRadius * Math.sin(labelRad);

    return { pathData, labelX, labelY, color, label, count, percent };
  };

  const slices = [
    createSlice(0, highAngle, '#EF4444', 'High Risk', stats.high, highPercent),
    createSlice(highAngle, mediumAngle, '#F97316', 'Medium Risk', stats.medium, mediumPercent),
    createSlice(highAngle + mediumAngle, 360 - (highAngle + mediumAngle), '#22C55E', 'Low Risk', stats.low, lowPercent),
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Distribution</h2>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <svg viewBox="0 0 300 300" className="w-64 h-64">
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.pathData}
                fill={slice.color}
                opacity="0.9"
                className="transition-opacity hover:opacity-100 cursor-pointer"
              />
              {slice.percent > 5 && (
                <text
                  x={slice.labelX}
                  y={slice.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-white font-bold text-sm pointer-events-none"
                >
                  {slice.percent.toFixed(1)}%
                </text>
              )}
            </g>
          ))}
        </svg>

        <div className="flex flex-col gap-4">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: slice.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {slice.label}
                </p>
                <p className="text-xs text-gray-600">
                  {slice.count} patients ({slice.percent.toFixed(1)}%)
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
