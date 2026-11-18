/**
 * FinSight India - LocalStorage Persistence & Backup/Restore Engine
 * Version: 2.1.0
 * 
 * Features:
 * - Versioned LocalStorage keys with automatic fallback & migration across versions
 * - Robust error handling for storage quota limits
 * - Full JSON backup generation & selective / merge restore
 */

import { APP_VERSION, DEFAULT_CATEGORIES, DEFAULT_RULES } from './constants.js';

const STORAGE_KEYS = {
  banks: ['finsight_banks_v210', 'finsight_banks_v190', 'finsight_banks_v180', 'finsight_banks_v170', 'finsight_banks_v160', 'finsight_banks_v150', 'finsight_banks_v140'],
  txns: ['finsight_txns_v210', 'finsight_txns_v190', 'finsight_txns_v180', 'finsight_txns_v170', 'finsight_txns_v160', 'finsight_txns_v150', 'finsight_txns_v140'],
  files: ['finsight_files_v210', 'finsight_files_v190', 'finsight_files_v180', 'finsight_files_v170', 'finsight_files_v160', 'finsight_files_v150', 'finsight_files_v140'],
  categories: ['finsight_categories_v210', 'finsight_categories_v190', 'finsight_categories_v180', 'finsight_categories_v170', 'finsight_categories_v160', 'finsight_categories_v150', 'finsight_categories_v140'],
  rules: ['finsight_rules_v210', 'finsight_rules_v190', 'finsight_rules_v180', 'finsight_rules_v170', 'finsight_rules_v160', 'finsight_rules_v150', 'finsight_rules_v140'],
  excludeTransfers: ['finsight_exclude_transfers_v210', 'finsight_exclude_transfers_v190', 'finsight_exclude_transfers_v180', 'finsight_exclude_transfers_v170', 'finsight_exclude_transfers_v160'],
  manualPairs: ['finsight_manual_pairs_v210', 'finsight_manual_pairs_v190', 'finsight_manual_pairs_v180', 'finsight_manual_pairs_v170', 'finsight_manual_pairs_v160'],
  unlinkedPairs: ['finsight_unlinked_pairs_v210', 'finsight_unlinked_pairs_v190', 'finsight_unlinked_pairs_v180', 'finsight_unlinked_pairs_v170', 'finsight_unlinked_pairs_v160'],
  transferDays: ['finsight_transfer_days_v210', 'finsight_transfer_days_v190', 'finsight_transfer_days_v180', 'finsight_transfer_days_v170', 'finsight_transfer_days_v160']
};

function getSavedItem(keyList, defaultValue) {
  try {
    for (const key of keyList) {
      const val = localStorage.getItem(key);
      if (val !== null && val !== undefined) {
        return JSON.parse(val);
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return defaultValue;
}

export function loadInitialState() {
  const banks = getSavedItem(STORAGE_KEYS.banks, []);
  const txns = getSavedItem(STORAGE_KEYS.txns, []);
  const uploadedFiles = getSavedItem(STORAGE_KEYS.files, []);
  
  const savedCategories = getSavedItem(STORAGE_KEYS.categories, null);
  const categories = savedCategories
    ? Array.from(new Set([...DEFAULT_CATEGORIES, ...savedCategories]))
    : DEFAULT_CATEGORIES;

  const rules = getSavedItem(STORAGE_KEYS.rules, DEFAULT_RULES);
  const excludeTransfers = getSavedItem(STORAGE_KEYS.excludeTransfers, true);
  const manualPairs = getSavedItem(STORAGE_KEYS.manualPairs, []);
  const unlinkedPairs = getSavedItem(STORAGE_KEYS.unlinkedPairs, []);
  const transferDays = getSavedItem(STORAGE_KEYS.transferDays, 2);

  return {
    banks,
    txns,
    uploadedFiles,
    categories,
    rules,
    excludeTransfers,
    manualPairs,
    unlinkedPairs,
    transferDays
  };
}

export function saveToStorage(keyName, data) {
  try {
    const primaryKey = STORAGE_KEYS[keyName] ? STORAGE_KEYS[keyName][0] : `finsight_${keyName}_v210`;
    localStorage.setItem(primaryKey, JSON.stringify(data));
    // Also save to v190 for backward compatibility if user downgrades
    if (STORAGE_KEYS[keyName] && STORAGE_KEYS[keyName][1]) {
      localStorage.setItem(STORAGE_KEYS[keyName][1], JSON.stringify(data));
    }
  } catch (e) {
    console.error(`Failed to save ${keyName} to localStorage:`, e);
  }
}

export function createBackupPayload(state) {
  return {
    app: 'FinSight India',
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      banks: state.banks || [],
      uploadedFiles: state.uploadedFiles || [],
      categories: state.categories || [],
      rules: state.rules || [],
      txns: state.txns || [],
      manualTransferPairs: state.manualPairs || [],
      unlinkedTransferPairs: state.unlinkedPairs || [],
      transferClearingDays: state.transferDays || 2,
      excludeTransfersFromTotals: state.excludeTransfers !== undefined ? state.excludeTransfers : true
    }
  };
}
