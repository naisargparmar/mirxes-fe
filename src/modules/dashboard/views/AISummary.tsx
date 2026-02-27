import { useState } from 'react';
import { PatientStats } from '../../../shared/types/patient';
import { Brain, Loader } from 'lucide-react';

interface AISummaryProps {
  stats: PatientStats;
}

interface SummaryResponse {
  stats: {
    patient_count: number;
    high_count: number;
    medium_count: number;
    low_count: number;
  };
  summary: string;
}

export function AISummary({ stats }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAskMe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/patients/stats/summary');
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      const data: SummaryResponse = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Summary</h2>
      <div className="space-y-6">
        {summary ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {error ? error : 'Click "Ask Me" to generate an AI summary of patient statistics'}
            </span>
          </div>
        )}

        <button
          onClick={handleAskMe}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Brain className="w-4 h-4" />
          )}
          {isLoading ? 'Generating...' : 'Ask Me'}
        </button>
      </div>
    </div>
  );
}
