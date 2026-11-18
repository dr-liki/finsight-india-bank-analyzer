/**
 * FinSight India - Balance & Financial Date Arithmetic Engine
 * Version: 2.1.0
 * 
 * Handles:
 * - True Initial / Opening Balance Calculation (reversing effect of first recorded transaction)
 * - Latest / Closing Balance Calculation (from last recorded running balance or forward projection)
 * - Date normalization & intra-day tie-breaking
 * - Periodic grouping (week, month, quarter, year)
 */

export function normalizeDate(raw) {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (typeof raw === 'number') {
    const utcDays = Math.floor(raw - 25569);
    const d = new Date(utcDays * 86400 * 1000);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const str = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dmy) {
    const day = dmy[1].padStart(2, '0');
    const month = dmy[2].padStart(2, '0');
    let year = dmy[3];
    if (year.length === 2) year = (parseInt(year, 10) > 50 ? '19' : '20') + year;
    return `${year}-${month}-${day}`;
  }
  const monMatch = str.match(/^(\d{1,2})[\/\-\s]+([A-Za-z]{3})[\/\-\s]+(\d{2,4})/);
  if (monMatch) {
    const day = monMatch[1].padStart(2, '0');
    const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
    const month = months[monMatch[2].toLowerCase()] || '01';
    let year = monMatch[3];
    if (year.length === 2) year = (parseInt(year, 10) > 50 ? '19' : '20') + year;
    return `${year}-${month}-${day}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

export function formatBalanceDate(dateStr) {
  if (!dateStr || dateStr === 'N/A' || dateStr === 'No txns' || dateStr === 'No statements') return 'No statements';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mon = months[parseInt(m, 10) - 1] || m;
    return `${parseInt(d, 10)} ${mon} ${y}`;
  }
  return dateStr;
}

export function parseAmount(val) {
  if (typeof val === 'number') return Math.abs(val);
  if (!val) return 0;
  const cleaned = String(val).replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.abs(num);
}

export function parseSignedAmount(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).trim();
  const isParenNeg = str.startsWith('(') && str.endsWith(')');
  const isDr = /\bdr\b/i.test(str);
  const cleaned = str.replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  if (isParenNeg || isDr || str.startsWith('-')) return -Math.abs(num);
  return num;
}

/**
 * Automatically analyze statement files for Initial & Latest bank balances
 * Following true Indian banking accounting principles:
 * - Bank statements record the closing running balance after each transaction.
 * - Initial Balance (opening balance before earliest txn):
 *     If earliest txn was CREDIT -> Initial = Bal - Amount
 *     If earliest txn was DEBIT  -> Initial = Bal + Amount
 * - Latest Balance takes the running balance of the last transaction that recorded a balance
 */
export function getBankBalanceInfo(bank, allTxns) {
  if (!bank) return { initial: 0, initialDate: 'No statements', latest: 0, latestDate: 'No statements', isManual: false, hasData: false };

  // 1. If user explicitly saved manual balance in modal:
  if (bank.isManualBalance && bank.latestBalance !== undefined && bank.latestBalance !== null) {
    return {
      initial: Number(bank.initialBalance) || 0,
      initialDate: bank.initialBalanceDate || 'N/A',
      latest: Number(bank.latestBalance) || 0,
      latestDate: bank.latestBalanceDate || 'N/A',
      isManual: true,
      hasData: true
    };
  }

  // 2. Filter all transactions assigned to this bank
  const bankTxns = (allTxns || []).filter(t => t.bank === bank.name);
  if (bankTxns.length === 0) {
    if (bank.initialBalance !== undefined && bank.initialBalance !== null) {
      return {
        initial: Number(bank.initialBalance) || 0,
        initialDate: bank.initialBalanceDate || 'No statements',
        latest: Number(bank.latestBalance || bank.initialBalance) || 0,
        latestDate: bank.latestBalanceDate || bank.initialBalanceDate || 'No statements',
        isManual: Boolean(bank.isManualBalance),
        hasData: true
      };
    }
    return {
      initial: 0,
      initialDate: 'No statements',
      latest: 0,
      latestDate: 'No statements',
      isManual: false,
      hasData: false
    };
  }

  // 3. Sort chronologically from oldest to newest:
  const sorted = [...bankTxns].sort((a, b) => {
    const timeA = new Date(a.date || '2026-01-01').getTime();
    const timeB = new Date(b.date || '2026-01-01').getTime();
    const diff = timeA - timeB;
    if (diff !== 0) return diff;

    // Same date tie-breaker: use true statement file sequence
    if (a.fileId && a.fileId === b.fileId) {
      const idxA = typeof a.fileOrderIndex === 'number' ? a.fileOrderIndex : 0;
      const idxB = typeof b.fileOrderIndex === 'number' ? b.fileOrderIndex : 0;
      if (a.fileDirection === 'DESC') {
        return idxB - idxA; // Higher row in DESC statement happened earlier
      }
      return idxA - idxB;   // Lower row in ASC statement happened earlier
    }

    return (a.id > b.id ? 1 : -1);
  });

  const earliestTxn = sorted[0];
  const latestTxn = sorted[sorted.length - 1];

  // 4. Find all transactions that recorded a balance from statement files:
  const txnsWithBal = sorted.filter(t => t.balance !== undefined && t.balance !== null && !isNaN(t.balance));

  if (txnsWithBal.length > 0) {
    const firstWithBal = txnsWithBal[0];
    const lastWithBal = txnsWithBal[txnsWithBal.length - 1];

    // True Initial Balance (opening balance before first transaction occurred):
    let initialBal = Number(firstWithBal.balance);
    if (firstWithBal.type === 'CREDIT') {
      initialBal -= Number(firstWithBal.amount || 0);
    } else {
      initialBal += Number(firstWithBal.amount || 0);
    }

    // Latest Balance Calculation: takes running balance of last transaction that recorded a balance,
    // plus any subsequent transactions that didn't have a balance recorded
    let latestBal = Number(lastWithBal.balance);
    const lastWithBalIdx = sorted.indexOf(lastWithBal);
    if (lastWithBalIdx !== -1 && lastWithBalIdx < sorted.length - 1) {
      for (let i = lastWithBalIdx + 1; i < sorted.length; i++) {
        const t = sorted[i];
        if (t.amount > 0) {
          latestBal += (t.type === 'CREDIT' ? Number(t.amount || 0) : -Number(t.amount || 0));
        }
      }
    }

    return {
      initial: Math.max(0, initialBal),
      initialDate: firstWithBal.date || earliestTxn.date,
      latest: latestBal,
      latestDate: latestTxn.date || lastWithBal.date,
      isManual: false,
      hasData: true
    };
  }

  // 5. Fallback for statements without balance column (e.g. mini-statements):
  const netFlow = bankTxns.reduce((sum, t) => sum + (t.type === 'CREDIT' ? Number(t.amount || 0) : -Number(t.amount || 0)), 0);
  const baseInitial = (bank.initialBalance !== undefined && bank.initialBalance !== null) ? Number(bank.initialBalance) : 0;
  const initialDate = bank.initialBalanceDate || earliestTxn.date;
  const latestDate = bank.latestBalanceDate || latestTxn.date;
  const latestBal = baseInitial + netFlow;

  return {
    initial: baseInitial,
    initialDate,
    latest: latestBal,
    latestDate,
    isManual: Boolean(bank.isManualBalance),
    hasData: true
  };
}

// PERIOD EXTRACTION HELPERS (WEEKWISE, MONTHWISE, QUARTERWISE, YEARWISE)
export function getIsoWeek(dateStr) {
  const d = new Date(dateStr || '2026-01-01');
  if (isNaN(d.getTime())) return { key: 'Unknown', label: 'Unknown' };
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNr = 1 + Math.ceil((firstThursday - target) / 604800000);
  const yr = new Date(firstThursday).getFullYear();
  const key = `${yr}-W${String(weekNr).padStart(2, '0')}`;
  const weekStart = new Date(firstThursday);
  weekStart.setDate(weekStart.getDate() - 3);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const startStr = weekStart.toISOString().slice(5, 10);
  const endStr = weekEnd.toISOString().slice(5, 10);
  return { key, label: `W${weekNr} (${startStr} - ${endStr})` };
}

export function getMonthInfo(dateStr) {
  const [yr, mo] = (dateStr || '2026-01-01').split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mIndex = parseInt(mo || '1', 10) - 1;
  const mName = months[mIndex] || 'Jan';
  return { key: `${yr}-${mo}`, label: `${mName} ${yr}` };
}

export function getQuarterInfo(dateStr) {
  const [yr, mo] = (dateStr || '2026-01-01').split('-');
  const q = Math.ceil((parseInt(mo || '1', 10)) / 3);
  return { key: `${yr}-Q${q}`, label: `${yr} Q${q}` };
}

export function getYearInfo(dateStr) {
  const yr = (dateStr || '2026-01-01').split('-')[0] || '2026';
  return { key: yr, label: yr };
}
