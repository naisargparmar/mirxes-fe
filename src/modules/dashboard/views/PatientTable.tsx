import { useState, useMemo, useCallback, useEffect } from 'react';
import { Patient, PatientStats } from '../../../shared/types/patient';
import { Search, ArrowUpDown, Download, FileText, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToCSV, generatePDF } from '../../../shared/utils/export';

interface PatientTableProps {
  patients: Patient[];
  stats: PatientStats[];
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  searchTerm?: string;
  filterCategory?: string
  onPageChange?: (page: number, pageSize: number, sortBy: string, sortOrder: 'asc' | 'desc', searchTerm: string, filterCategory: string) => void;
  isLoading?: boolean;
}

export function PatientTable({
  patients,
  stats,
  totalCount = 0,
  currentPage = 1,
  pageSize = 100,
  searchTerm = '',
  filterCategory = 'All',
  onPageChange,
  isLoading = false
}: PatientTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Patient; direction: 'asc' | 'desc' }>({
    key: 'patient_id',
    direction: 'asc',
  });
  const [localPage, setLocalPage] = useState(currentPage);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter((patient) => {
      const matchesSearch = patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || patient.risk_category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    // console.log(filtered);
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [patients, searchTerm, filterCategory, sortConfig, filterCategory]);

  const handleSearch = useCallback(
    (term: string) => {
      // setSearchTerm(term);
      // localStorage.setItem('searchTerm', term);
      setLocalPage(1);

      if (onPageChange) {
        onPageChange(1, pageSize, sortConfig.key, sortConfig.direction, term, filterCategory);
      }
    },
    [onPageChange, pageSize, sortConfig, filterCategory]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        handleSearch(localSearchTerm);
      }
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, handleSearch, searchTerm]);

  const handleFilterCategory = useCallback(
    (category: string) => {
      // setFilterCategory(category);
      // localStorage.setItem('filterCategory', category);
      if (onPageChange) {
        setLocalPage(1);
        onPageChange(1, pageSize, sortConfig.key, sortConfig.direction, searchTerm, category);
      }
    },
    [filterCategory, onPageChange, pageSize, sortConfig.key, sortConfig.direction, searchTerm]
  );

  const handleSort = useCallback(
    (key: keyof Patient) => {
      const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      setSortConfig({
        key,
        direction: newDirection,
      });
      if (onPageChange) {
        setLocalPage(1);
        onPageChange(1, pageSize, key, newDirection, searchTerm, filterCategory);
      }
    },
    [sortConfig, pageSize, onPageChange, searchTerm, filterCategory]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setLocalPage(newPage);
      if (onPageChange) {
        onPageChange(newPage, pageSize, sortConfig.key, sortConfig.direction, searchTerm, filterCategory);
      }
    },
    [pageSize, sortConfig, onPageChange, searchTerm, filterCategory]
  );

  const totalPages = Math.ceil((totalCount || patients.length) / pageSize);

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Patient Records</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Patient ID..."
              value={localSearchTerm}

              onChange={(e) => setLocalSearchTerm(e.target.value)}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            // onChange={(e) => setFilterCategory(e.target.value)}
            onChange={(e) => handleFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <button
            onClick={() => exportToCSV(filteredAndSortedPatients)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => generatePDF(filteredAndSortedPatients, stats)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('patient_id')}
                  className="flex items-center gap-2 hover:text-gray-700"
                  disabled={isLoading}
                >
                  Patient ID
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('risk_score')}
                  className="flex items-center gap-2 hover:text-gray-700"
                  disabled={isLoading}
                >
                  Risk Score
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => handleSort('risk_category')}
                  className="flex items-center gap-2 hover:text-gray-700"
                  disabled={isLoading}
                >
                  Risk Category
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flag
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No patients found
                </td>
              </tr>
            ) : (
              filteredAndSortedPatients.map((patient) => (
                <tr key={patient.patient_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {patient.patient_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.risk_score.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(patient.risk_category)}`}>
                      {patient.risk_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.risk_category === 'High' && (
                      <Flag className="w-5 h-5 text-red-600" />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {(localPage - 1) * pageSize + 1} to {Math.min(localPage * pageSize, totalCount || patients.length)} of {totalCount || patients.length} patients
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(localPage - 1)}
            disabled={localPage === 1 || isLoading}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-1">
            {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  page === localPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))} */}
              
              <button
                onClick={() => handlePageChange(localPage + 1)}
                disabled={true}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {localPage}
              </button>
          </div>

          <button
            onClick={() => handlePageChange(localPage + 1)}
            disabled={localPage === totalPages || isLoading}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
