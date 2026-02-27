import { useState, useEffect } from 'react';
import { Patient, PatientStats } from '../../../shared/types/patient';
import { fetchPatients, fetchPatientStats } from '../../../shared/services/patientService';
import { SummaryCards } from '../views/SummaryCards';
import { RiskChart } from '../views/RiskChart';
import { RiskPieChart } from '../views/RiskPieChart';
import { AISummary } from '../views/AISummary';
import { PatientTable } from '../views/PatientTable';
import { UploadForm } from '../../upload/views/UploadForm';
import { Activity, Loader, AlertCircle } from 'lucide-react';

export function DashboardController() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [stats, setStats] = useState<PatientStats>({ total: 0, high: 0, medium: 0, low: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'patient_id',
    direction: 'asc',
  });

  const loadPatients = async (page: number = 1, size: number = 100, sortBy: string = 'patient_id', sortOrder: 'asc' | 'desc' = 'asc', searchTerm: string = '', filterCategory: string = 'All') => {
    setIsLoading(true);
    setError(null);

    try {
      const [patientData, statsData] = await Promise.all([
        fetchPatients(page, size, sortBy, sortOrder, searchTerm, filterCategory),
        fetchPatientStats()
      ]);

      setPatients(patientData.patients);
      setTotalPatients(patientData.total);
      setStats(statsData);
      setCurrentPage(page);
      setSearchTerm(searchTerm);
      setFilterCategory(filterCategory);
      setSortConfig({ key: sortBy, direction: sortOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number, size: number, sortBy: string, sortOrder: 'asc' | 'desc', searchTerm: string, filterCategory: string) => {
    loadPatients(page, size, sortBy, sortOrder, searchTerm, filterCategory);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleUploadSuccess = () => {
    loadPatients();
    setShowUpload(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={loadPatients}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Risk System</h1>
                <p className="text-sm text-gray-600">Patient Risk Assessment Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showUpload ? 'Hide Upload' : 'Upload Data'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {showUpload && (
            <UploadForm onUploadSuccess={handleUploadSuccess} />
          )}

          <SummaryCards stats={stats} />
          <AISummary stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RiskPieChart stats={stats} />
            <RiskChart stats={stats} />
          </div>

          <PatientTable
            patients={patients}
            stats={stats}
            totalCount={totalPatients}
            currentPage={currentPage}
            pageSize={pageSize}
            searchTerm={searchTerm}
            filterCategory={filterCategory}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
}
