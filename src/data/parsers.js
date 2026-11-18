/**
 * FinSight India - Statement Parsing Engine (Excel, CSV, PDF)
 * Version: 2.1.0
 * 
 * Supports:
 * - SheetJS Excel (.xlsx, .xls) and CSV parsing with dynamic column mapping
 * - Mozilla PDF.js coordinate text extraction with password support
 * - Balance column extraction & overdraft detection ('Dr' flag)
 * - Explicit Opening / Closing Balance row & summary box parsing
 * - Automatic bank detection for Indian banks (UBI, SBI, HDFC, ICICI, Axis, Kotak, Canara, BoB, PNB, etc.)
 * - Channel identification (UPI, NEFT, IMPS, NACH, POS, ATM)
 */

import * as pdfjsLib from 'pdfjs-dist';
import { normalizeDate, parseAmount, parseSignedAmount } from './balanceEngine.js';
import { detectCategoryWithRules } from './categorizationEngine.js';

// Configure PDF.js worker via CDN for Android WebView compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export function autoDetectBankName(text, userBanks = []) {
  const s = (text || '').toLowerCase();
  for (const b of userBanks) {
    if (s.includes(b.name.toLowerCase())) return b.name;
  }
  if (s.includes('ubin') || s.includes('union bank') || s.includes('union bank of india')) return 'Union Bank of India';
  if (s.includes('hdfc')) return 'HDFC Bank';
  if (s.includes('sbin') || s.includes('state bank') || s.includes('sbi')) return 'SBI';
  if (s.includes('icic')) return 'ICICI Bank';
  if (s.includes('utib') || s.includes('axis')) return 'Axis Bank';
  if (s.includes('kkbk') || s.includes('kotak')) return 'Kotak Bank';
  if (s.includes('cnrb') || s.includes('canara')) return 'Canara Bank';
  if (s.includes('barb') || s.includes('baroda')) return 'Bank of Baroda';
  if (s.includes('punb') || s.includes('pnb')) return 'PNB';
  return '';
}

export function detectChannel(narration) {
  const s = (narration || '').toUpperCase();
  if (s.includes('UPI')) return 'UPI';
  if (s.includes('NEFT')) return 'NEFT';
  if (s.includes('IMPS')) return 'IMPS';
  if (s.includes('ACH') || s.includes('NACH') || s.includes('ECS') || s.includes('SIP')) return 'NACH';
  if (s.includes('POS') || s.includes('CARD') || s.includes('ECOM')) return 'POS';
  if (s.includes('ATM')) return 'ATM';
  return 'OTHER';
}

/**
 * Tabular matrix parser with robust Indian bank balance detection, order preservation & tie-breaking
 */
export function parseSheetMatrix(matrix, fileName, fileId, preferredBank, banks = [], rules = []) {
  const detected = autoDetectBankName(fileName + ' ' + JSON.stringify(matrix.slice(0, 25)), banks);
  const resolvedBank = preferredBank && preferredBank !== 'AUTO'
    ? preferredBank
    : (detected || (banks[0] ? banks[0].name : fileName.split('.')[0].slice(0, 16) || 'Primary Bank'));

  let headerRowIdx = -1;
  let colMap = { date: -1, narration: -1, debit: -1, credit: -1, amount: -1, type: -1, ref: -1, balance: -1 };

  for (let i = 0; i < Math.min(matrix.length, 35); i++) {
    const row = (matrix[i] || []).map(c => String(c || '').toLowerCase().trim());
    const hasDate = row.some(c => c.includes('date') || c.includes('dt') || c.includes('tran date') || c.includes('txndate'));
    const hasNarr = row.some(c => c.includes('narration') || c.includes('description') || c.includes('particular') || c.includes('remarks') || c.includes('details'));
    if (hasDate && (hasNarr || row.length >= 3)) {
      headerRowIdx = i;
      row.forEach((cell, idx) => {
        const isBalCol = (cell.includes('balance') || cell.includes('bal')) && !cell.includes('balance b/f') && !cell.includes('balance c/f') && !cell.includes('opening') && !cell.includes('dr/cr') && !cell.includes('cr/dr');
        const isDrCrCol = cell === 'type' || cell === 'dr/cr' || cell === 'cr/dr' || cell.includes('dr / cr') || cell.includes('cr / dr') || cell === 'txn type' || cell === 'transaction type';

        if (isBalCol && colMap.balance === -1) {
          colMap.balance = idx;
        } else if (isDrCrCol && colMap.type === -1) {
          colMap.type = idx;
        } else {
          if (colMap.date === -1 && (cell.includes('date') || cell.includes('txn dt') || cell.includes('value dt') || cell.includes('tran date') || cell.includes('txndate') || cell.includes('transaction date'))) colMap.date = idx;
          if (colMap.narration === -1 && (cell.includes('narration') || cell.includes('description') || cell.includes('particular') || cell.includes('remarks') || cell.includes('details'))) colMap.narration = idx;
          if (colMap.debit === -1 && (cell.includes('debit') || cell.includes('withdrawal') || cell === 'dr' || cell.startsWith('dr ') || cell.endsWith(' dr') || cell.includes('dr amt') || cell.includes('debit amt'))) colMap.debit = idx;
          if (colMap.credit === -1 && (cell.includes('credit') || cell.includes('deposit') || cell === 'cr' || cell.startsWith('cr ') || cell.endsWith(' cr') || cell.includes('cr amt') || cell.includes('credit amt'))) colMap.credit = idx;
          if (colMap.amount === -1 && (cell === 'amount' || cell.includes('tran amt') || cell.includes('txn amt') || (cell.includes('amount') && !cell.includes('withdrawal') && !cell.includes('deposit')))) colMap.amount = idx;
          if (colMap.ref === -1 && (cell.includes('tran id') || cell.includes('chq') || cell.includes('ref no') || cell.includes('cheque') || cell.includes('utr'))) colMap.ref = idx;
        }
      });
      break;
    }
  }

  const parsedTxns = [];
  const startIdx = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;
  let explicitOpeningBalance = undefined;
  let explicitOpeningDate = undefined;
  let explicitClosingBalance = undefined;
  let explicitClosingDate = undefined;

  for (let i = startIdx; i < matrix.length; i++) {
    const row = matrix[i];
    if (!row || row.length < 2) continue;

    let dateRaw = colMap.date !== -1 ? row[colMap.date] : row[0];
    let narrRaw = colMap.narration !== -1 ? row[colMap.narration] : row[1];
    if (!narrRaw && row.length > 2) narrRaw = row[2];

    let debit = colMap.debit !== -1 ? parseAmount(row[colMap.debit]) : 0;
    let credit = colMap.credit !== -1 ? parseAmount(row[colMap.credit]) : 0;
    let amt = colMap.amount !== -1 ? parseAmount(row[colMap.amount]) : 0;

    let balanceVal = undefined;
    if (colMap.balance !== -1 && row[colMap.balance] !== undefined && row[colMap.balance] !== null) {
      const rawBalStr = String(row[colMap.balance]).trim();
      if (rawBalStr !== '' && rawBalStr !== '-') {
        balanceVal = parseSignedAmount(rawBalStr);
      }
    }

    const narrStr = String(narrRaw || '').trim();
    const narrLower = narrStr.toLowerCase();

    // Check for explicit Opening Balance / Balance B/F row in Excel
    const isOpeningRow = narrLower.includes('opening balance') ||
                         narrLower.includes('balance b/f') ||
                         narrLower.includes('bal b/f') ||
                         narrLower.includes('brought forward') ||
                         narrLower.includes('by balance b/f') ||
                         narrLower.includes('to balance b/f');

    if (isOpeningRow) {
      const openingAmt = balanceVal !== undefined ? balanceVal : (credit > 0 ? credit : (amt > 0 ? amt : debit));
      if (openingAmt !== undefined && !isNaN(openingAmt)) {
        explicitOpeningBalance = openingAmt;
        explicitOpeningDate = normalizeDate(dateRaw);
      }
      continue;
    }

    // Check for explicit Closing Balance / Balance C/F row in Excel
    const isClosingRow = narrLower.includes('closing balance') ||
                         narrLower.includes('balance c/f') ||
                         narrLower.includes('bal c/f') ||
                         narrLower.includes('carried forward') ||
                         narrLower.includes('by balance c/f') ||
                         narrLower.includes('to balance c/f');

    if (isClosingRow) {
      const closingAmt = balanceVal !== undefined ? balanceVal : (debit > 0 ? debit : (amt > 0 ? amt : credit));
      if (closingAmt !== undefined && !isNaN(closingAmt)) {
        explicitClosingBalance = closingAmt;
        explicitClosingDate = normalizeDate(dateRaw);
      }
      continue;
    }

    if (colMap.debit === -1 && colMap.credit === -1 && colMap.amount === -1) {
      const nums = row.slice(2).map(parseAmount).filter(n => n > 0);
      if (nums.length >= 1) debit = nums[0];
    }

    let type = 'DEBIT';
    let finalAmount = 0;

    if (credit > 0 && debit === 0) {
      type = 'CREDIT';
      finalAmount = credit;
    } else if (debit > 0) {
      type = 'DEBIT';
      finalAmount = debit;
    } else if (amt > 0) {
      finalAmount = amt;
      const typeCell = colMap.type !== -1 ? String(row[colMap.type] || '').toUpperCase() : String(row.join(' ')).toUpperCase();
      type = (typeCell.includes('CR') || typeCell.includes('CREDIT')) ? 'CREDIT' : 'DEBIT';
    }

    if (finalAmount > 0 && narrStr) {
      parsedTxns.push({
        id: `imp-${fileId}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        fileId,
        fileName,
        fileOrderIndex: i,
        date: normalizeDate(dateRaw),
        narration: narrStr,
        amount: finalAmount,
        type,
        bank: resolvedBank,
        channel: detectChannel(narrStr),
        category: detectCategoryWithRules(narrStr, type, rules),
        isManualCategory: false,
        balance: balanceVal !== undefined && !isNaN(balanceVal) ? balanceVal : undefined
      });
    }
  }

  // Determine statement chronological direction (Ascending vs Descending)
  let fileDirection = 'ASC';
  if (parsedTxns.length >= 2) {
    const firstTime = new Date(parsedTxns[0].date).getTime();
    const lastTime = new Date(parsedTxns[parsedTxns.length - 1].date).getTime();
    if (firstTime > lastTime) {
      fileDirection = 'DESC'; // Newest at top
    }
  }

  parsedTxns.forEach(t => {
    t.fileDirection = fileDirection;
  });

  if (parsedTxns.length > 0) {
    const earliest = fileDirection === 'DESC' ? parsedTxns[parsedTxns.length - 1] : parsedTxns[0];
    const latest = fileDirection === 'DESC' ? parsedTxns[0] : parsedTxns[parsedTxns.length - 1];
    if (explicitOpeningBalance !== undefined && earliest) {
      earliest.statementOpeningBalance = explicitOpeningBalance;
      earliest.statementOpeningDate = explicitOpeningDate || earliest.date;
    }
    if (explicitClosingBalance !== undefined && latest) {
      latest.statementClosingBalance = explicitClosingBalance;
      latest.statementClosingDate = explicitClosingDate || latest.date;
    }
  }

  return { parsedTxns, resolvedBank, explicitOpeningBalance, explicitClosingBalance };
}

/**
 * PDF Parser with balance stripping, summary box detection, and exact credit/debit classification
 */
export async function parsePdfBuffer(arrayBuffer, fileName, fileId, preferredBank, banks = [], rules = [], password = '') {
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password: password || undefined });
    const pdf = await loadingTask.promise;
    let fullLines = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const itemsByY = {};
      textContent.items.forEach(item => {
        const y = Math.round(item.transform[5] / 4) * 4;
        if (!itemsByY[y]) itemsByY[y] = [];
        itemsByY[y].push({ x: item.transform[4], str: item.str });
      });
      const sortedY = Object.keys(itemsByY).map(Number).sort((a, b) => b - a);
      sortedY.forEach(y => {
        const lineStr = itemsByY[y].sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim();
        if (lineStr) fullLines.push(lineStr);
      });
    }

    const detected = autoDetectBankName(fileName + ' ' + fullLines.slice(0, 30).join(' '), banks);
    const resolvedBank = preferredBank && preferredBank !== 'AUTO'
      ? preferredBank
      : (detected || (banks[0] ? banks[0].name : fileName.split('.')[0].slice(0, 16) || 'Primary Bank'));

    // Pre-pass: Scan PDF summary boxes for Opening Balance and Closing Balance
    let statementOpeningBalance = undefined;
    let statementClosingBalance = undefined;

    for (const line of fullLines.slice(0, 50)) {
      if (statementOpeningBalance === undefined) {
        const m = line.match(/(?:opening\s*bal(?:ance)?|bal(?:ance)?\s*b\/?f|brought\s*forward)[\s:]*(?:rs\.?|inr)?[\s:]*([\d,]+\.\d{2})/i);
        if (m) statementOpeningBalance = parseAmount(m[1]);
      }
      if (statementClosingBalance === undefined) {
        const m = line.match(/(?:closing\s*bal(?:ance)?|available\s*bal(?:ance)?|bal(?:ance)?\s*c\/?f)[\s:]*(?:rs\.?|inr)?[\s:]*([\d,]+\.\d{2})/i);
        if (m) statementClosingBalance = parseAmount(m[1]);
      }
    }

    for (const line of fullLines.slice(-35)) {
      if (statementClosingBalance === undefined) {
        const m = line.match(/(?:closing\s*bal(?:ance)?|available\s*bal(?:ance)?|clear\s*bal(?:ance)?)[\s:]*(?:rs\.?|inr)?[\s:]*([\d,]+\.\d{2})/i);
        if (m) statementClosingBalance = parseAmount(m[1]);
      }
    }

    const parsedTxns = [];
    const dateRegex = /^(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d{1,2}[\/\-][A-Za-z]{3}[\/\-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})\s+(.+)/;

    fullLines.forEach((line, idx) => {
      const match = line.match(dateRegex);
      if (match) {
        const rawDate = match[1];
        const rest = match[2];
        const numMatches = rest.match(/[\d,]+\.\d{2}/g);
        if (numMatches && numMatches.length >= 1) {
          const amountVal = parseAmount(numMatches[0]);
          let pdfBalance = undefined;

          if (numMatches.length >= 2) {
            const lastNumStr = numMatches[numMatches.length - 1];
            const possibleBal = parseAmount(lastNumStr);
            // Check if Dr (overdraft) exists after the balance number
            const postBalText = rest.slice(rest.lastIndexOf(lastNumStr) + lastNumStr.length);
            const isOverdraft = /\bdr\b/i.test(postBalText);
            pdfBalance = isOverdraft ? -possibleBal : possibleBal;
          }

          const lowerLine = line.toLowerCase();
          // Handle table row opening or closing balances
          if (lowerLine.includes('opening balance') || lowerLine.includes('balance b/f') || lowerLine.includes('bal b/f') || lowerLine.includes('brought forward') || lowerLine.includes('by balance b/f')) {
            if (pdfBalance !== undefined) statementOpeningBalance = Math.abs(pdfBalance);
            else if (amountVal > 0) statementOpeningBalance = amountVal;
            return;
          }
          if (lowerLine.includes('closing balance') || lowerLine.includes('balance c/f') || lowerLine.includes('bal c/f') || lowerLine.includes('carried forward')) {
            if (pdfBalance !== undefined) statementClosingBalance = Math.abs(pdfBalance);
            else if (amountVal > 0) statementClosingBalance = amountVal;
            return;
          }

          // Strip balance number and any trailing Cr/Dr from line before credit/debit classification
          let txnText = rest;
          if (pdfBalance !== undefined && numMatches.length >= 2) {
            const lastNumStr = numMatches[numMatches.length - 1];
            txnText = rest.slice(0, rest.lastIndexOf(lastNumStr));
          }

          const hasExplicitCredit = /\b(CR|CREDIT|NEFT CR|IMPS CR|RTGS CR|UPI CR|SALARY|DEP|DEPOSIT|REFUND|REVERSAL|INTEREST)\b/i.test(txnText);
          const hasExplicitDebit = /\b(DR|DEBIT|WITHDRAWAL|WDL|CHQ|POS|ATM|PURCHASE)\b/i.test(txnText);

          let type = 'DEBIT';
          if (hasExplicitCredit && !hasExplicitDebit) {
            type = 'CREDIT';
          } else if (hasExplicitDebit) {
            type = 'DEBIT';
          }

          const narrClean = txnText.replace(/[\d,]+\.\d{2}/g, '').replace(/\s+/g, ' ').trim();
          if (amountVal > 0 && narrClean.length > 2) {
            parsedTxns.push({
              id: `pdf-${fileId}-${idx}`,
              fileId,
              fileName,
              fileOrderIndex: idx,
              date: normalizeDate(rawDate),
              narration: narrClean.slice(0, 90),
              amount: amountVal,
              type,
              bank: resolvedBank,
              channel: detectChannel(narrClean),
              category: detectCategoryWithRules(narrClean, type, rules),
              isManualCategory: false,
              balance: pdfBalance !== undefined && !isNaN(pdfBalance) ? pdfBalance : undefined
            });
          }
        }
      }
    });

    // Determine PDF statement direction
    let fileDirection = 'ASC';
    if (parsedTxns.length >= 2) {
      const firstTime = new Date(parsedTxns[0].date).getTime();
      const lastTime = new Date(parsedTxns[parsedTxns.length - 1].date).getTime();
      if (firstTime > lastTime) {
        fileDirection = 'DESC';
      }
    }
    parsedTxns.forEach(t => {
      t.fileDirection = fileDirection;
    });

    if (parsedTxns.length > 0) {
      const earliest = fileDirection === 'DESC' ? parsedTxns[parsedTxns.length - 1] : parsedTxns[0];
      const latest = fileDirection === 'DESC' ? parsedTxns[0] : parsedTxns[parsedTxns.length - 1];
      if (statementOpeningBalance !== undefined && earliest) {
        earliest.statementOpeningBalance = statementOpeningBalance;
        earliest.statementOpeningDate = earliest.date;
      }
      if (statementClosingBalance !== undefined && latest) {
        latest.statementClosingBalance = statementClosingBalance;
        latest.statementClosingDate = latest.date;
      }
    }

    return { success: true, txns: parsedTxns, resolvedBank, statementOpeningBalance, statementClosingBalance };
  } catch (err) {
    if (err && (err.name === 'PasswordException' || String(err.message || '').toLowerCase().includes('password'))) {
      return { needsPassword: true };
    }
    return { success: false, error: err.message || 'Could not parse PDF' };
  }
}
