/**
 * FinSight India - Application Constants & Material Design 3 Design Tokens
 * Version: 2.2.0
 */

export const APP_VERSION = '2.2.0';

// MD3 Tonal Color Tokens
export const MD3_THEME = {
  surface: '#0f131a',
  surfaceDim: '#0b0e14',
  surfaceContainerLowest: '#0d1017',
  surfaceContainerLow: '#151922',
  surfaceContainer: '#1b202a',
  surfaceContainerHigh: '#222733',
  surfaceContainerHighest: '#292f3d',
  
  primary: '#10b981',             // Mint / Emerald
  primaryContainer: '#004d36',
  onPrimaryContainer: '#9df3cf',
  
  secondary: '#38bdf8',           // Sky Blue
  secondaryContainer: '#034b75',
  onSecondaryContainer: '#bae6fd',
  
  tertiary: '#a78bfa',            // Lavender / Violet
  tertiaryContainer: '#4c1d95',
  onTertiaryContainer: '#ddd6fe',
  
  error: '#f87171',               // Coral / Rose
  errorContainer: '#5c1313',
  onErrorContainer: '#fecaca',
  
  outline: '#4b5563',
  outlineVariant: '#2e3542',
  
  onSurface: '#f1f5f9',
  onSurfaceVariant: '#94a3b8'
};

// Chart & Category Color Palettes
export const COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#64748b', '#a855f7', '#06b6d4',
  '#eab308', '#f97316', '#84cc16'
];

export const EARN_COLORS = [
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#14b8a6',
  '#84cc16', '#22c55e', '#a855f7', '#38bdf8', '#f59e0b'
];

export const BANK_COLOR_PALETTE = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16'
];

export const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Groceries & Quick Commerce',
  'Investments & SIP',
  'Fuel & Transport',
  'Bills & Utilities',
  'Healthcare & Medical',
  'Shopping & Books',
  'Rent & Housing',
  'Salary & Income',
  'Transfers & UPI',
  'Bank Transfer',
  'Interest/Cashback',
  'Friend',
  'Family',
  'Cash Out',
  'Uncategorized'
];

// Smarter & Accurate keyword definitions with transaction direction awareness
export const DEFAULT_RULES = [
  {
    cat: 'Salary & Income',
    scope: 'CREDIT',
    keys: ['salary', 'stipend', 'fellowship', 'payroll', 'remuneration', 'monthly salary', 'wages', 'bonus', 'director fee', 'professional fee', 'consulting fee', 'client payout', 'employer']
  },
  {
    cat: 'Interest/Cashback',
    scope: 'CREDIT',
    keys: ['int.pd', 'interest credit', 'sb int', 'quarterly int', 'interest paid', 'cashback', 'reward points', 'reward credit', 'refund', 'reversal', 'tax refund', 'it refund', 'cred cashback', 'gpay reward', 'paytm cashback', 'credit adjustment']
  },
  {
    cat: 'Food & Dining',
    scope: 'DEBIT',
    keys: ['swiggy', 'zomato', 'restaurant', 'cafe', 'starbucks', 'dominos', 'mcdonalds', 'kfc', 'burger king', 'burger', 'eatfit', 'bakery', 'pizza', 'subway', 'haldiram', 'barbeque nation', 'barbeque', 'chaayos', 'chai point', 'dineout', 'sweet', 'bhojanalaya', 'dhaba', 'biryani', 'darshini']
  },
  {
    cat: 'Groceries & Quick Commerce',
    scope: 'DEBIT',
    keys: ['zepto', 'blinkit', 'instamart', 'bigbasket', 'dmart', 'reliance smart', 'more supermarket', 'nature basket', 'supermarket', 'grocery', 'milk', 'country delight', 'bbdaily', 'freshtohome', 'licious', 'dunzo', 'kirana', 'provision store', 'vegetable', 'fruits']
  },
  {
    cat: 'Investments & SIP',
    scope: 'BOTH',
    keys: ['zerodha', 'groww', 'ppfas', 'mutual fund', 'ach d-', 'sip', 'nps', 'epfo', 'kuvera', 'indmoney', 'uti mutual', 'hdfc mutual', 'sbi mutual', 'icici pru', 'coin', 'smallcase', 'upstox', 'angel one', 'lic premium', 'lic of india', 'lic', 'navi mf', 'mirae', 'motilal', 'nippon', 'axis mf', 'tata mf', 'parag parikh', 'sovereign gold', 'sgb', 'dividend', 'mf redemption']
  },
  {
    cat: 'Fuel & Transport',
    scope: 'DEBIT',
    keys: ['petrol', 'diesel', 'cng', 'fuel', 'hpcl', 'bpcl', 'iocl', 'indian oil', 'shell', 'uber', 'ola cabs', 'ola', 'rapido', 'fastag', 'toll', 'irctc', 'indian railway', 'metro', 'indigo', 'air india', 'spicejet', 'akasa', 'namma yatri', 'makemytrip', 'easemytrip', 'redbus', 'abhibus', 'yulu', 'bounce']
  },
  {
    cat: 'Bills & Utilities',
    scope: 'DEBIT',
    keys: ['bescom', 'airtel', 'jio', 'vodafone', 'vi recharge', 'act fibernet', 'electricity', 'water bill', 'gas bill', 'indane', 'hp gas', 'bharat gas', 'adani gas', 'recharge', 'bbps', 'bwssb', 'tataplay', 'dish tv', 'broadband', 'dth', 'credit card', 'cc payment', 'cred', 'billdesk', 'sbicard', 'hdfc card', 'icici card', 'axis card', 'kotak card', 'onecard', 'slice', 'emi', 'bajaj finance', 'hdb financial', 'cholamandalam', 'home loan', 'car loan']
  },
  {
    cat: 'Healthcare & Medical',
    scope: 'DEBIT',
    keys: ['hospital', 'manipal', 'apollo', 'pharmeasy', '1mg', 'tata 1mg', 'pharmacy', 'clinic', 'medplus', 'st johns', 'diagnostic', 'pathology', 'dr lal', 'metropolis health', 'max hospital', 'fortis', 'practo', 'chemist', 'medical', 'medicine', 'dentist', 'eye care']
  },
  {
    cat: 'Shopping & Books',
    scope: 'DEBIT',
    keys: ['amazon', 'flipkart', 'myntra', 'blossom book', 'decathlon', 'nykaa', 'ajio', 'meesho', 'croma', 'reliance digital', 'ikea', 'zara', 'h&m', 'uniqlo', 'tata cliq', 'lenskart', 'titan', 'tanishq', 'westside', 'shoppers stop', 'lifestyle', 'crossword', 'book']
  },
  {
    cat: 'Rent & Housing',
    scope: 'DEBIT',
    keys: ['rent', 'nobroker', 'maintenance', 'mygate', 'society', 'landlord', 'apartment maintenance', 'flat rent', 'house rent', 'nestaway', 'urban company', 'housing.com', 'magicbricks']
  },
  {
    cat: 'Bank Transfer',
    scope: 'BOTH',
    keys: ['fund transfer', 'neft', 'rtgs', 'imps', 'transfer to', 'trf from', 'trf to', 'internal transfer', 'self transfer', 'own account', 'own a/c', 'sweep trf', 'auto sweep']
  },
  {
    cat: 'Friend',
    scope: 'BOTH',
    keys: ['splitwise', 'settleup', 'friend', 'roommate', 'trip expense', 'dinner share']
  },
  {
    cat: 'Family',
    scope: 'BOTH',
    keys: ['family', 'mother', 'father', 'sister', 'brother', 'parents', 'home expense', 'son', 'daughter', 'wife', 'husband']
  },
  {
    cat: 'Cash Out',
    scope: 'DEBIT',
    keys: ['atm wdl', 'cash wdl', 'atm cash', 'self wdl', 'cash withdrawal', 'nfs*', 'nfs ', 'atm-', 'cash dispense', 'micro atm', 'cash out', 'atm withdrawal']
  }
];

export const POPULAR_INDIAN_BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Union Bank of India',
  'Punjab National Bank',
  'Canara Bank',
  'Bank of Baroda',
  'IndusInd Bank',
  'IDFC FIRST Bank',
  'Federal Bank',
  'Yes Bank'
];
