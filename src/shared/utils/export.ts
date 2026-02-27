import { Patient, PatientStats } from '../types/patient';

export const exportToCSV = (patients: Patient[]) => {
  const headers = ['Patient ID', 'Risk Score', 'Risk Category'];
  const rows = patients.map((p) => [p.patient_id, p.risk_score.toFixed(2), p.risk_category]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `patient_risk_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generatePDF = (patients: Patient[], stats?: PatientStats) => {
  console.log("stats", stats)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Clinical Risk Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 40px;
          color: #333;
        }
        h1 {
          color: #2563eb;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 10px;
        }
        h2 {
          color: #4b5563;
          margin-top: 30px;
        }
        .summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .summary-card {
          padding: 20px;
          border-left: 4px solid;
          background: #f9fafb;
        }
        .summary-card.total { border-left-color: #2563eb; }
        .summary-card.high { border-left-color: #dc2626; }
        .summary-card.medium { border-left-color: #ea580c; }
        .summary-card.low { border-left-color: #16a34a; }
        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #6b7280;
        }
        .summary-card p {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        th {
          background-color: #f3f4f6;
          font-weight: 600;
          color: #374151;
        }
        tr:hover {
          background-color: #f9fafb;
        }
        .risk-high { color: #dc2626; font-weight: 600; }
        .risk-medium { color: #ea580c; font-weight: 600; }
        .risk-low { color: #16a34a; font-weight: 600; }
        .flag { color: #dc2626; }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>Clinical Risk Assessment Report</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>

      ${stats ? `
      <h2>Summary Statistics</h2>
      <div class="summary">
        <div class="summary-card total">
          <h3>Total Patients</h3>
          <p>${stats.total}</p>
        </div>
        <div class="summary-card high">
          <h3>High Risk</h3>
          <p>${stats.high}</p>
        </div>
        <div class="summary-card medium">
          <h3>Medium Risk</h3>
          <p>${stats.medium}</p>
        </div>
        <div class="summary-card low">
          <h3>Low Risk</h3>
          <p>${stats.low}</p>
        </div>
      </div>
      ` : ''}

      <h2>Patient Details</h2>
      <table>
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Risk Score</th>
            <th>Risk Category</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          ${patients.map((patient) => `
            <tr>
              <td>${patient.patient_id}</td>
              <td>${patient.risk_score.toFixed(2)}</td>
              <td class="risk-${patient.risk_category.toLowerCase()}">${patient.risk_category}</td>
              <td>${patient.risk_category === 'High' ? '<span class="flag">⚠</span>' : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Clinical Risk System - Confidential Medical Report</p>
        <p>Total Records: ${patients.length}</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
