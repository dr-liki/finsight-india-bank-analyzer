/**
 * FinSight India - Smart Bank Transfers Detection & Pairing Engine
 * Version: 2.1.0
 * 
 * Features:
 * - Cross-bank debit-to-credit matching within clearing window (default: 2 days)
 * - Reference number / UTR / transaction sequence matching
 * - Keyword matching (NEFT, IMPS, RTGS, UPI, Self-transfer)
 * - User manual pair enforcement
 * - User unlinked exclusion enforcement
 */

export function detectTransferPairs(transactionsList, manualPairs = [], unlinkedPairs = [], clearingDays = 2) {
  if (!transactionsList || transactionsList.length < 2) return [];
  const pairs = [];
  const matchedDebitIds = new Set();
  const matchedCreditIds = new Set();

  const txnMap = new Map();
  transactionsList.forEach(t => txnMap.set(t.id, t));

  // Build unlinked set of pair signatures (bidirectional)
  const unlinkedSet = new Set();
  (unlinkedPairs || []).forEach(p => {
    unlinkedSet.add(`${p.debitTxnId}:${p.creditTxnId}`);
    unlinkedSet.add(`${p.creditTxnId}:${p.debitTxnId}`);
  });

  // 1. Process Manual Pairs first!
  (manualPairs || []).forEach(mp => {
    const d = txnMap.get(mp.debitTxnId);
    const c = txnMap.get(mp.creditTxnId);
    if (d && c && !matchedDebitIds.has(d.id) && !matchedCreditIds.has(c.id)) {
      matchedDebitIds.add(d.id);
      matchedCreditIds.add(c.id);
      pairs.push({
        pairId: mp.pairId || `manual-${d.id}-${c.id}`,
        debitTxnId: d.id,
        creditTxnId: c.id,
        fromBank: d.bank,
        toBank: c.bank,
        amount: d.amount,
        date: d.date,
        diffDays: Math.abs(new Date(d.date || '2026-01-01').getTime() - new Date(c.date || '2026-01-01').getTime()) / 86400000,
        isManualPair: true
      });
    }
  });

  // 2. Auto-detect pairs for remaining unpaired transactions
  const debits = transactionsList.filter(t => t.type === 'DEBIT' && !matchedDebitIds.has(t.id));
  const credits = transactionsList.filter(t => t.type === 'CREDIT' && !matchedCreditIds.has(t.id));

  for (const d of debits) {
    if (matchedDebitIds.has(d.id)) continue;
    const dDateStr = d.date || '2026-01-01';
    const dDate = new Date(dDateStr).getTime();
    const dAmt = Number(d.amount);
    if (!dAmt || dAmt <= 0) continue;
    const dNarr = (d.narration || '').toLowerCase();
    const dBank = (d.bank || '').toLowerCase();

    for (const c of credits) {
      if (matchedCreditIds.has(c.id)) continue;
      // Skip if explicitly unlinked by user
      if (unlinkedSet.has(`${d.id}:${c.id}`)) continue;

      const cBank = (c.bank || '').toLowerCase();
      if (dBank && cBank && dBank === cBank) continue;

      const cAmt = Number(c.amount);
      if (Math.abs(dAmt - cAmt) > 0.01) continue;

      const cDateStr = c.date || '2026-01-01';
      const cDate = new Date(cDateStr).getTime();
      const diffDays = Math.abs(dDate - cDate) / (1000 * 60 * 60 * 24);
      if (diffDays > clearingDays) continue;

      const cNarr = (c.narration || '').toLowerCase();
      const transferKeywords = [
        'upi', 'neft', 'imps', 'rtgs', 'fund transfer', 'transfer', 'trf', 'self',
        'internal', 'own a/c', 'own ac', 'to ', 'from ', 'sweep', 'transfer to', 'trf from'
      ];
      const hasKeyword = transferKeywords.some(k => dNarr.includes(k) || cNarr.includes(k));

      const dDigits = (dNarr.match(/\b\d{6,16}\b/g) || []);
      const cDigits = (cNarr.match(/\b\d{6,16}\b/g) || []);
      const hasMatchingRef = dDigits.some(dig => cDigits.includes(dig));

      if (diffDays === 0 || hasKeyword || hasMatchingRef) {
        matchedDebitIds.add(d.id);
        matchedCreditIds.add(c.id);
        const pairId = `pair-${d.id}-${c.id}`;
        pairs.push({
          pairId,
          debitTxnId: d.id,
          creditTxnId: c.id,
          fromBank: d.bank,
          toBank: c.bank,
          amount: dAmt,
          date: d.date,
          diffDays,
          isManualPair: false
        });
        break;
      }
    }
  }
  return pairs;
}
