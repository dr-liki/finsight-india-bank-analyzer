/**
 * FinSight India - Export & Document Generation Engine
 * Version: 2.1.0
 * 
 * Generates:
 * - Formatted Excel Workbooks (XLSX) with summary KPIs and column widths
 * - RFC 4180 CSV with UTF-8 BOM
 * - High-resolution PDF reports with KPI cards, color-coded tabular ledger, and page numbering
 * - Native Android Share Sheet via @capacitor/share & @capacitor/filesystem
 */

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

// UNIVERSAL SAVE & SHARE ENGINE (ANDROID NATIVE + WEB DESKTOP)
export async function saveOrShareFile({ filename, mimeType, base64Data, textData, blob }) {
  try {
    if (Capacitor.isNativePlatform()) {
      let dataToWrite = base64Data;
      if (!dataToWrite && textData) {
        const bytes = new TextEncoder().encode(textData);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        dataToWrite = btoa(binary);
      } else if (!dataToWrite && blob) {
        dataToWrite = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result;
            const b64 = String(res).split(',')[1];
            resolve(b64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const fileResult = await Filesystem.writeFile({
        path: filename,
        data: dataToWrite,
        directory: Directory.Cache
      });

      await Share.share({
        title: filename,
        text: `FinSight India: ${filename}`,
        url: fileResult.uri,
        dialogTitle: 'Save or Share File'
      });

      return { success: true, native: true, uri: fileResult.uri };
    } else {
      let downloadBlob = blob;
      if (!downloadBlob && textData) {
        downloadBlob = new Blob([textData], { type: mimeType });
      } else if (!downloadBlob && base64Data) {
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        downloadBlob = new Blob([byteArray], { type: mimeType });
      }

      const url = URL.createObjectURL(downloadBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, native: false };
    }
  } catch (err) {
    if (err && (String(err).toLowerCase().includes('canceled') || String(err).toLowerCase().includes('cancelled') || String(err).toLowerCase().includes('dismissed'))) {
      return { success: true, native: true, dismissed: true };
    }
    throw err;
  }
}

// EXPORT 1: PROPERLY FORMATTED EXCEL WORKBOOK (XLSX)
export async function exportToXlsx({ filtered = [] }) {
  if (!filtered.length) throw new Error('No transactions to export');

  const exportRows = filtered.map(t => ({
    'Date': t.date || '',
    'Bank': t.bank || '',
    'Channel': t.channel || '',
    'Narration': t.narration || '',
    'Category': t.category || '',
    'Type': t.type || '',
    'Amount (INR)': t.amount || 0,
    'Balance (INR)': t.balance !== undefined && t.balance !== null ? t.balance : ''
  }));

  const totalDebit = filtered.filter(t => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0);
  const totalCredit = filtered.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const net = totalCredit - totalDebit;

  exportRows.push({});
  exportRows.push({ 'Narration': 'TOTAL OUTFLOW (DEBITS)', 'Amount (INR)': totalDebit });
  exportRows.push({ 'Narration': 'TOTAL INFLOW (CREDITS)', 'Amount (INR)': totalCredit });
  exportRows.push({ 'Narration': 'NET CASHFLOW BALANCE', 'Amount (INR)': net });

  const ws = XLSX.utils.json_to_sheet(exportRows);

  ws['!cols'] = [
    { wch: 13 },
    { wch: 18 },
    { wch: 12 },
    { wch: 45 },
    { wch: 26 },
    { wch: 10 },
    { wch: 16 },
    { wch: 16 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  const b64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const filename = `FinSight_Statement_${new Date().toISOString().slice(0, 10)}.xlsx`;

  return await saveOrShareFile({
    filename,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    base64Data: b64
  });
}

// EXPORT 2: PROPERLY FORMATTED RFC 4180 CSV WITH UTF-8 BOM
export async function exportToCsv({ filtered = [] }) {
  if (!filtered.length) throw new Error('No transactions to export');

  const headers = ['Date', 'Bank', 'Channel', 'Narration', 'Category', 'Type', 'Amount (INR)', 'Balance (INR)'];
  const rows = filtered.map(t => [
    t.date || '',
    t.bank || '',
    t.channel || '',
    `"${(t.narration || '').replace(/"/g, '""')}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    t.type || '',
    (t.amount || 0).toFixed(2),
    t.balance !== undefined && t.balance !== null ? Number(t.balance).toFixed(2) : ''
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const filename = `FinSight_Statement_${new Date().toISOString().slice(0, 10)}.csv`;

  return await saveOrShareFile({
    filename,
    mimeType: 'text/csv;charset=utf-8;',
    textData: csvContent
  });
}

// EXPORT 3: PROPERLY FORMATTED PDF STATEMENT REPORT
export async function exportToPdf({
  filtered = [],
  totalTxnsCount = 0,
  durationMode = 'PRESET',
  selectedWeeks = [],
  selectedMonths = [],
  selectedQuarters = [],
  selectedYears = [],
  customFrom = '',
  customTo = '',
  datePreset = 'ALL',
  bankFilter = 'ALL',
  selectedCategories = []
}) {
  if (!filtered.length) throw new Error('No transactions to export');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Top Dark Slate Header Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('FinSight India', 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Multi-Bank Statement & Transactions Report', 14, 19);

  let durationLabel = 'All Time';
  if (durationMode === 'WEEKWISE') durationLabel = `Weeks: ${selectedWeeks.join(', ') || 'All'}`;
  else if (durationMode === 'MONTHWISE') durationLabel = `Months: ${selectedMonths.join(', ') || 'All'}`;
  else if (durationMode === 'QUARTERWISE') durationLabel = `Quarters: ${selectedQuarters.join(', ') || 'All'}`;
  else if (durationMode === 'YEARWISE') durationLabel = `Years: ${selectedYears.join(', ') || 'All'}`;
  else if (durationMode === 'CUSTOM') durationLabel = `Custom: ${customFrom || 'Start'} to ${customTo || 'End'}`;
  else if (durationMode === 'PRESET' && datePreset !== 'ALL') durationLabel = `Preset: ${datePreset}`;

  const filterScope = `Scope: ${filtered.length} of ${totalTxnsCount || filtered.length} txns | Bank: ${bankFilter} | Category: ${selectedCategories.length ? `${selectedCategories.length} selected` : 'All'}`;
  doc.text(`Duration: ${durationLabel}  •  ${filterScope}`, 14, 25);

  // Summary KPI Cards
  const totalDebit = filtered.filter(t => t.type === 'DEBIT').reduce((s, t) => s + t.amount, 0);
  const totalCredit = filtered.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const net = totalCredit - totalDebit;

  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 37, 58, 16, 2, 2, 'FD');
  doc.roundedRect(76, 37, 58, 16, 2, 2, 'FD');
  doc.roundedRect(138, 37, 58, 16, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL INFLOW', 18, 43);
  doc.text('TOTAL OUTFLOW', 80, 43);
  doc.text('NET BALANCE', 142, 43);

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Rs. ${totalCredit.toLocaleString('en-IN')}`, 18, 50);

  doc.setTextColor(225, 29, 72);
  doc.text(`Rs. ${totalDebit.toLocaleString('en-IN')}`, 80, 50);

  doc.setTextColor(net >= 0 ? 16 : 225, net >= 0 ? 185 : 29, net >= 0 ? 129 : 72);
  doc.text(`${net >= 0 ? '+' : ''}Rs. ${net.toLocaleString('en-IN')}`, 142, 50);

  const tableData = filtered.map(t => [
    t.date || '',
    t.bank || '',
    t.channel || '',
    t.narration || '',
    t.category || '',
    t.type || '',
    `${t.type === 'CREDIT' ? '+' : '-'}Rs. ${(t.amount || 0).toLocaleString('en-IN')}`
  ]);

  autoTable(doc, {
    startY: 58,
    head: [['Date', 'Bank', 'Channel', 'Narration', 'Category', 'Type', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 24 },
      2: { cellWidth: 16 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30 },
      5: { cellWidth: 16 },
      6: { cellWidth: 24, halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.section === 'body' && data.column.index === 6) {
        if (data.cell.raw && String(data.cell.raw).startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
    didDrawPage: function(data) {
      const str = 'Page ' + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 8);
      doc.text('FinSight India • 100% On-Device Financial Analytics', 120, doc.internal.pageSize.height - 8);
    }
  });

  const pdfDataUri = doc.output('datauristring');
  const b64 = pdfDataUri.split(',')[1];
  const filename = `FinSight_Statement_${new Date().toISOString().slice(0, 10)}.pdf`;

  return await saveOrShareFile({
    filename,
    mimeType: 'application/pdf',
    base64Data: b64
  });
}
