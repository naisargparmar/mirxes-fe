import { PatientStats } from '../../../shared/types/patient';
import { Users, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface SummaryCardsProps {
  stats: PatientStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Risk</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.high}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Medium Risk</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.medium}</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Low Risk</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.low}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
