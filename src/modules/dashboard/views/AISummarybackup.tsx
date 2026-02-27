import { PatientStats } from '../../../shared/types/patient';
import { Brain } from 'lucide-react';


interface AISummaryProps {
  stats: PatientStats;
}

export function AISummaryOLD({ stats }: AISummaryProps) {
  const maxValue = Math.max(stats.high, stats.medium, stats.low);
  const scale = maxValue > 0 ? 100 / maxValue : 0;

  const categories = [
    { label: 'High Risk', count: stats.high, color: 'bg-red-500', percentage: stats.total > 0 ? (stats.high / stats.total) * 100 : 0 },
    { label: 'Medium Risk', count: stats.medium, color: 'bg-orange-500', percentage: stats.total > 0 ? (stats.medium / stats.total) * 100 : 0 },
    { label: 'Low Risk', count: stats.low, color: 'bg-green-500', percentage: stats.total > 0 ? (stats.low / stats.total) * 100 : 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Summary</h2>
      <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">AI summary service is temporarily unavailable due to rate limiting. Please try again in a moment.</span>
            </div>
            
            <button
                // onClick={() => generatePDF(filteredAndSortedPatients, stats)}
                className="flex btn btn-primary btn-sm items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
                <Brain className="w-4 h-4" />
            {/* <FileText className="w-4 h-4" /> */}
            Ask Me
            </button>
            
          </div>
      </div>
    </div>
  );
}
