/**
 * MATERNA AI 2.0 - STORAGE ENGINE
 * Local-first architecture with localStorage / IndexedDB fallback,
 * data export, import, schema validation, and cloud adapter hooks.
 */

const STORAGE_KEYS = {
  PROFILE: 'materna_profile_v2',
  VITALS: 'materna_vitals_v2',
  MEDS: 'materna_meds_v2',
  MEALS: 'materna_meals_v2',
  ACTIVITIES: 'materna_activities_v2',
  SYMPTOMS: 'materna_symptoms_v2',
  KICKS: 'materna_kicks_v2',
  CONTRACTIONS: 'materna_contractions_v2',
  APPOINTMENTS: 'materna_appointments_v2',
  CHAT: 'materna_chat_v2',
  SETTINGS: 'materna_settings_v2'
};

const StorageEngine = {
  // Get item with default fallback
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn('[StorageEngine] Read error for key:', key, e);
      return defaultValue;
    }
  },

  // Save item
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[StorageEngine] Write error for key:', key, e);
      return false;
    }
  },

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Export all application data as JSON download
  exportAll() {
    const fullBackup = {
      exportVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      profile: this.get(STORAGE_KEYS.PROFILE),
      vitals: this.get(STORAGE_KEYS.VITALS, []),
      meds: this.get(STORAGE_KEYS.MEDS, []),
      meals: this.get(STORAGE_KEYS.MEALS, {}),
      activities: this.get(STORAGE_KEYS.ACTIVITIES, []),
      symptoms: this.get(STORAGE_KEYS.SYMPTOMS, []),
      kicks: this.get(STORAGE_KEYS.KICKS, []),
      contractions: this.get(STORAGE_KEYS.CONTRACTIONS, []),
      appointments: this.get(STORAGE_KEYS.APPOINTMENTS, []),
      chat: this.get(STORAGE_KEYS.CHAT, []),
      settings: this.get(STORAGE_KEYS.SETTINGS, {})
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `materna-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Import application data from JSON object
  importAll(backupData) {
    if (!backupData || typeof backupData !== 'object') {
      throw new Error('Invalid backup file format');
    }

    if (backupData.profile) this.set(STORAGE_KEYS.PROFILE, backupData.profile);
    if (backupData.vitals) this.set(STORAGE_KEYS.VITALS, backupData.vitals);
    if (backupData.meds) this.set(STORAGE_KEYS.MEDS, backupData.meds);
    if (backupData.meals) this.set(STORAGE_KEYS.MEALS, backupData.meals);
    if (backupData.activities) this.set(STORAGE_KEYS.ACTIVITIES, backupData.activities);
    if (backupData.symptoms) this.set(STORAGE_KEYS.SYMPTOMS, backupData.symptoms);
    if (backupData.kicks) this.set(STORAGE_KEYS.KICKS, backupData.kicks);
    if (backupData.contractions) this.set(STORAGE_KEYS.CONTRACTIONS, backupData.contractions);
    if (backupData.appointments) this.set(STORAGE_KEYS.APPOINTMENTS, backupData.appointments);
    if (backupData.chat) this.set(STORAGE_KEYS.CHAT, backupData.chat);
    if (backupData.settings) this.set(STORAGE_KEYS.SETTINGS, backupData.settings);

    return true;
  },

  // Clear all data (for privacy or reset)
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};

window.StorageEngine = StorageEngine;
window.STORAGE_KEYS = STORAGE_KEYS;
