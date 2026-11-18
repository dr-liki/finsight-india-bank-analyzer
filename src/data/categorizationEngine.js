/**
 * FinSight India - Transaction Categorization & Rule Engine
 * Version: 2.1.0
 * 
 * Features:
 * - Scope-aware regex compilation ('CREDIT', 'DEBIT', or 'BOTH')
 * - Token-boundary matching with regex escaping
 * - Indian banking heuristics (UPI, IMPS, NEFT, ATM, NACH, etc.)
 * - Manual categorization protection (isManualCategory)
 */

// Precompile categorization rules into token-boundary regexes with scope awareness
export function compileRulesEngine(rulesList) {
  if (!rulesList || !rulesList.length) return [];
  return rulesList.map(r => {
    if (!r || !r.keys || !r.keys.length) return null;
    const escaped = r.keys
      .map(k => String(k || '').trim().toLowerCase())
      .filter(Boolean)
      .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!escaped.length) return null;
    const pattern = `(^|[^a-z0-9])(${escaped.join('|')})([^a-z0-9]|$)`;
    return {
      cat: r.cat,
      scope: r.scope || 'BOTH', // 'CREDIT', 'DEBIT', or 'BOTH'
      regex: new RegExp(pattern, 'i')
    };
  }).filter(Boolean);
}

// SMARTER & ACCURATE DEBIT & CREDIT TRANSACTION CATEGORIZATION EVALUATOR
export function evaluateTransactionCategory(narration, type, compiledRules) {
  const s = (narration || '').toLowerCase();
  const isCredit = type === 'CREDIT';

  // Pass 1: Exact rule match matching transaction type scope ('CREDIT', 'DEBIT', or 'BOTH')
  for (const cr of compiledRules) {
    if (cr.scope === 'CREDIT' && !isCredit) continue;
    if (cr.scope === 'DEBIT' && isCredit) continue;
    if (cr.regex.test(s)) return cr.cat;
  }

  // Pass 2: Secondary rule match across any category
  for (const cr of compiledRules) {
    if (cr.regex.test(s)) return cr.cat;
  }

  // Pass 3: Smart contextual classification for Indian Banking
  if (isCredit) {
    if (/int\.pd|interest|sb int|quarterly int|interest paid/.test(s)) return 'Interest/Cashback';
    if (/cashback|reward points|reward credit|reward|refund|reversal|tax refund|it refund|cred cashback|gpay reward|paytm cashback/.test(s)) return 'Interest/Cashback';
    if (/salary|stipend|payroll|remuneration|monthly salary|wages|fellowship|director fee|professional fee/.test(s)) return 'Salary & Income';
    if (/dividend|redemption|mf redemption|mutual fund payout/.test(s)) return 'Investments & SIP';
    if (/splitwise|settleup|dinner share/.test(s)) return 'Friend';
    if (/family|mother|father|sister|brother|parents|son|daughter|wife|husband/.test(s)) return 'Family';
    if (/fund transfer|neft|rtgs|imps|transfer to|trf from|trf to|internal transfer|self transfer/.test(s)) return 'Bank Transfer';
    if (/upi\//.test(s)) return 'Transfers & UPI';
    return 'Uncategorized';
  } else {
    if (/atm wdl|cash wdl|atm cash|self wdl|cash withdrawal|nfs\*|nfs |atm-|cash dispense|micro atm|cash out/.test(s)) return 'Cash Out';
    if (/bescom|airtel|jio|vodafone|vi recharge|electricity|water bill|gas bill|recharge|bbps|credit card|cc payment|cred|billdesk|sbicard|emi|loan/.test(s)) return 'Bills & Utilities';
    if (/upi\//.test(s)) return 'Transfers & UPI';
    return 'Uncategorized';
  }
}

export function detectCategoryWithRules(narration, type, currentRules = []) {
  const compiled = compileRulesEngine(currentRules);
  return evaluateTransactionCategory(narration, type, compiled);
}

// AUTO-CATEGORIZATION RULES RUNNER
export function applyCategorizationRules(transactionsList, rulesList) {
  if (!transactionsList || !transactionsList.length) return { updatedTxns: [], changedCount: 0 };
  const compiled = compileRulesEngine(rulesList);
  let changedCount = 0;

  const updatedTxns = transactionsList.map(t => {
    // CRITICAL: Preserve manual category changes permanently across restarts
    if (t.isManualCategory) return t;

    const matchedCat = evaluateTransactionCategory(t.narration, t.type, compiled);

    if (matchedCat !== t.category) {
      changedCount++;
      return { ...t, category: matchedCat };
    }
    return t;
  });

  return { updatedTxns, changedCount };
}
