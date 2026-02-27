import { ApiResponse, PatientStats } from '../types/patient';

//const API_BASE_URL = import.meta.env.PROD ? 'http://0.0.0.0:8000/api' : '/api';
const API_BASE_URL = 'http://localhost:8000';

const STATIC_DATA: ApiResponse = {
  total: 5,
  page: 1,
  page_size: 100,
  patients: [
    {
      patient_id: "P001",
      risk_score: 0.87,
      risk_category: "High"
    },
    {
      patient_id: "P002",
      risk_score: 0.34,
      risk_category: "Low"
    },
    {
      patient_id: "P003",
      risk_score: 0.1,
      risk_category: "Low"
    },
    {
      patient_id: "P004",
      risk_score: 0.9,
      risk_category: "High"
    },
    {
      patient_id: "P005",
      risk_score: 0,
      risk_category: "Low"
    }
  ]
};

export const fetchPatients = async (
  page: number = 1,
  pageSize: number = 100,
  sortBy: string = 'risk_score',
  sortOrder: 'asc' | 'desc' = 'asc',
  searchTerm: string = '',
  filterCategory: string = 'All'
): Promise<ApiResponse> => {
  try {
    console.log("filterCategory: ", filterCategory)
    const par_risk_category = filterCategory != 'All' ? '&risk_category='+ filterCategory : '';
    const response = await fetch(
      // url,
      `${API_BASE_URL}/patients/?page=${page}&page_size=${pageSize}&sort_by=${sortBy}&sort_order=${sortOrder}&q=${searchTerm}${par_risk_category}`,
      {
        headers: {
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }

    return response.json();
  } catch (error) {
    console.warn('API unavailable, using static data:', error);
    return STATIC_DATA;
  }
};

export const uploadCSV = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/patients/upload`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload CSV');
  }

  return response.json();
};

export const fetchPatientStats = async (): Promise<PatientStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/patients/stats`, {
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient stats');
    }

    const data = await response.json();
    return {
      total: data.patient_count,
      high: data.high_count,
      medium: data.medium_count,
      low: data.low_count,
    };
  } catch (error) {
    console.warn('Stats API unavailable:', error);
    return {
      total: 123,
      high: 10,
      medium: 50,
      low: 63,
    };
  }
};
