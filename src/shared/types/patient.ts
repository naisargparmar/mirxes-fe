export interface Patient {
  patient_id: string;
  risk_score: number;
  risk_category: 'High' | 'Medium' | 'Low';
}

export interface PatientStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}

export interface ApiResponse {
  patients: Patient[];
  total: number;
  page: number;
  page_size: number;
}
