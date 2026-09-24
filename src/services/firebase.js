import { FALLBACK_SCRIPTS } from '../data/fallbackScripts';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBCZdUq2gEmz_Zhc7XAnY0oa9Uds3hk1lI",
  projectId: "rocketscriptz-hub",
};

export async function fetchScriptsFromFirebase() {
  // 1. Try local storage cache first for instant render
  let cached = null;
  try {
    const raw = localStorage.getItem('spidey_scripts_cache');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) cached = parsed;
    }
  } catch (e) {
    console.warn('Cache parse error:', e);
  }

  // 2. Fetch fresh data from Firestore REST API
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/database?key=${FIREBASE_CONFIG.apiKey}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.fields && data.fields.scriptsJson && typeof data.fields.scriptsJson.stringValue === 'string') {
        const parsed = JSON.parse(data.fields.scriptsJson.stringValue);
        if (Array.isArray(parsed)) {
          localStorage.setItem('spidey_scripts_cache', JSON.stringify(parsed));
          return { scripts: parsed, source: 'cloud' };
        }
      }
    }
  } catch (err) {
    console.warn('[Firestore Live Sync Warning]:', err.message);
  }

  // 3. Fallback to cached or empty
  if (Array.isArray(cached)) {
    return { scripts: cached, source: 'cache' };
  }

  return { scripts: [], source: 'empty' };
}

export async function fetchSettingsFromFirebase() {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/database?key=${FIREBASE_CONFIG.apiKey}&_t=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data.fields && data.fields.settingsJson && data.fields.settingsJson.stringValue) {
        return JSON.parse(data.fields.settingsJson.stringValue);
      }
    }
  } catch (e) {
    console.warn('Settings load error:', e);
  }
  return {
    siteTitle: "Spidey",
    siteHandle: "@Spidey",
    announcementText: "",
    discordUrl: "https://discord.gg",
    youtubeUrl: "https://youtube.com"
  };
}
