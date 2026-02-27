import { Patient, PatientStats } from '../types/patient';

const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

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

export const generatePDF = async (patients: Patient[], stats?: PatientStats) => {
  let aiSummary: string | null = null;

  if (stats) {
    try {
      const response = await fetch('http://localhost:8000/patients/stats/summary');
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.summary === 'string') {
          aiSummary = data.summary;
        }
      }
    } catch {
      aiSummary = null;
    }
  }

  const total = stats?.total ?? 0;
  const high = stats?.high ?? 0;
  const medium = stats?.medium ?? 0;
  const low = stats?.low ?? 0;

  const safeTotal = total || 1;
  const highPercent = (high / safeTotal) * 100;
  const mediumPercent = (medium / safeTotal) * 100;
  const lowPercent = (low / safeTotal) * 100;

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const highLength = (highPercent / 100) * circumference;
  const mediumLength = (mediumPercent / 100) * circumference;
  const lowLength = (lowPercent / 100) * circumference;

  const riskPieChartSvg = stats
    ? `
      <svg viewBox="0 0 220 220" class="risk-pie">
        <g transform="translate(110,110) rotate(-90)">
          <circle
            r="${radius}"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="40"
          />
          <circle
            r="${radius}"
            fill="none"
            stroke="#dc2626"
            stroke-width="40"
            stroke-dasharray="${highLength} ${circumference - highLength}"
            stroke-dashoffset="0"
          />
          <circle
            r="${radius}"
            fill="none"
            stroke="#f97316"
            stroke-width="40"
            stroke-dasharray="${mediumLength} ${circumference - mediumLength}"
            stroke-dashoffset="${-highLength}"
          />
          <circle
            r="${radius}"
            fill="none"
            stroke="#16a34a"
            stroke-width="40"
            stroke-dasharray="${lowLength} ${circumference - lowLength}"
            stroke-dashoffset="${-(highLength + mediumLength)}"
          />
        </g>
        <text x="110" y="110" text-anchor="middle" dominant-baseline="middle" class="risk-pie-center">
          ${total}
        </text>
      </svg>
    `
    : '';

  const riskBarChartHtml = stats
    ? `
      <div class="risk-bars">
        <div class="risk-bar-row">
          <div class="risk-bar-label">High Risk</div>
          <div class="risk-bar-track">
            <div class="risk-bar-fill high" style="width: ${highPercent}%;"></div>
          </div>
          <div class="risk-bar-value">${high} (${highPercent.toFixed(1)}%)</div>
        </div>
        <div class="risk-bar-row">
          <div class="risk-bar-label">Medium Risk</div>
          <div class="risk-bar-track">
            <div class="risk-bar-fill medium" style="width: ${mediumPercent}%;"></div>
          </div>
          <div class="risk-bar-value">${medium} (${mediumPercent.toFixed(1)}%)</div>
        </div>
        <div class="risk-bar-row">
          <div class="risk-bar-label">Low Risk</div>
          <div class="risk-bar-track">
            <div class="risk-bar-fill low" style="width: ${lowPercent}%;"></div>
          </div>
          <div class="risk-bar-value">${low} (${lowPercent.toFixed(1)}%)</div>
        </div>
      </div>
    `
    : '';

  const escapedSummary = aiSummary ? escapeHtml(aiSummary) : null;

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
        .section {
          margin-top: 30px;
        }
        .ai-summary {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 16px;
          font-size: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .charts {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-top: 20px;
        }
        .chart {
          background-color: #ffffff;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          padding: 16px;
        }
        .chart h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #374151;
        }
        .risk-pie {
          display: block;
          margin: 0 auto;
          width: 220px;
          height: 220px;
        }
        .risk-pie-center {
          font-size: 18px;
          font-weight: 600;
          fill: #111827;
        }
        .legend {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 12px;
          color: #4b5563;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-color {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
        }
        .risk-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        .risk-bar-row {
          display: grid;
          grid-template-columns: 80px 1fr 90px;
          gap: 8px;
          align-items: center;
          font-size: 12px;
        }
        .risk-bar-label {
          color: #374151;
          font-weight: 500;
        }
        .risk-bar-track {
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
          height: 14px;
        }
        .risk-bar-fill {
          height: 100%;
          border-radius: 9999px;
        }
        .risk-bar-fill.high {
          background-color: #dc2626;
        }
        .risk-bar-fill.medium {
          background-color: #f97316;
        }
        .risk-bar-fill.low {
          background-color: #16a34a;
        }
        .risk-bar-value {
          text-align: right;
          color: #4b5563;
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

      <div class="section">
        <h2>AI Summary</h2>
        <div class="ai-summary">
          <p>${escapedSummary || 'No AI summary available for the current patient statistics.'}</p>
        </div>
      </div>

      <div class="section">
        <h2>Risk Distribution</h2>
        <div class="charts">
          <div class="chart">
            <h3>Risk Distribution Pie Chart</h3>
            ${riskPieChartSvg}
            <div class="legend">
              <div class="legend-item">
                <span class="legend-color" style="background-color: #dc2626;"></span>
                <span>High Risk (${high})</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #f97316;"></span>
                <span>Medium Risk (${medium})</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #16a34a;"></span>
                <span>Low Risk (${low})</span>
              </div>
            </div>
          </div>
          <div class="chart">
            <h3>Risk Distribution Chart</h3>
            ${riskBarChartHtml}
          </div>
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
