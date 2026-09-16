// Report Generator Utility - CSV Export and PDF Generation using jsPDF
import { jsPDF } from 'jspdf';

/**
 * Downloads a data array as a CSV file
 * @param {Array<Object>} data - array of plain objects
 * @param {string} filename - output file name
 */
export function exportToCSV(data, filename = 'report.csv') {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] === null || row[header] === undefined ? '' : row[header];
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads an official Ministry-formatted PDF report
 * @param {Object} reportConfig - { title, subtitle, date, stats, tableHeaders, tableRows, filename }
 */
export function generateMinistryPDFReport({
  title = 'National Land Acquisition Report',
  subtitle = 'Ministry of Rural Development & MoRTH • Government of India',
  date = new Date().toLocaleDateString('en-IN'),
  stats = [],
  tableHeaders = [],
  tableRows = [],
  filename = 'National_Land_Acquisition_Report.pdf'
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Top Sovereign Tricolor Accent
  doc.setFillColor(255, 153, 51); // Saffron
  doc.rect(0, 0, pageWidth / 3, 3, 'F');
  doc.setFillColor(255, 255, 255); // White
  doc.rect(pageWidth / 3, 0, pageWidth / 3, 3, 'F');
  doc.setFillColor(19, 136, 8); // Emerald
  doc.rect((pageWidth * 2) / 3, 0, pageWidth / 3, 3, 'F');

  // 2. Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('BHOOMI SETU: NATIONAL LAND ACQUISITION SYSTEM', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(234, 88, 12);
  doc.text(title.toUpperCase(), 14, 30);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated On: ${date} | Official Copy | DILRMP 3.0 Standard`, 14, 36);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, 39, pageWidth - 14, 39);

  let y = 46;

  // 3. KPI Highlights Cards (if provided)
  if (stats && stats.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('EXECUTIVE SUMMARY BENCHMARKS', 14, y);
    y += 5;

    const cardWidth = (pageWidth - 28 - (stats.length - 1) * 3) / Math.min(stats.length, 4);
    stats.slice(0, 4).forEach((st, idx) => {
      const x = 14 + idx * (cardWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, y, cardWidth, 16, 2, 2, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(st.label || '', x + 3, y + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('' + (st.value || ''), x + 3, y + 12);
    });

    y += 24;
  }

  // 4. Data Table
  if (tableHeaders && tableHeaders.length && tableRows && tableRows.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('STATUTORY RECORD DATASET', 14, y);
    y += 5;

    const colWidth = (pageWidth - 28) / tableHeaders.length;

    // Table Header Row
    doc.setFillColor(15, 23, 42);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    tableHeaders.forEach((th, idx) => {
      doc.text(th, 16 + idx * colWidth, y + 5);
    });
    y += 8;

    // Table Rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    tableRows.slice(0, 22).forEach((row, rIdx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      if (rIdx % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, y - 1, pageWidth - 28, 6.5, 'F');
      }
      doc.setTextColor(30, 41, 59);
      row.forEach((cell, cIdx) => {
        const textVal = String(cell || '');
        doc.text(textVal.substring(0, 24), 16 + cIdx * colWidth, y + 3.5);
      });
      y += 6.5;
    });
  }

  // Footer on bottom of page
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Confidential - For Central Ministry Official Use Only | Bhoomi Setu National Command Center', 14, 287);
  doc.text(`Page 1 of 1`, pageWidth - 30, 287);

  // Bottom Tricolor
  doc.setFillColor(255, 153, 51);
  doc.rect(0, 294, pageWidth / 3, 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth / 3, 294, pageWidth / 3, 3, 'F');
  doc.setFillColor(19, 136, 8);
  doc.rect((pageWidth * 2) / 3, 294, pageWidth / 3, 3, 'F');

  doc.save(filename);
}
