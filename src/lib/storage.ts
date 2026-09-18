const API_KEY_STORAGE = 'omniagent_gemini_api_key';
const MODEL_STORAGE = 'omniagent_selected_model';
const PERSONA_STORAGE = 'omniagent_selected_persona';

export const storage = {
  getApiKey(): string {
    try {
      return localStorage.getItem(API_KEY_STORAGE) ?? '';
    } catch {
      return '';
    }
  },
  setApiKey(key: string): void {
    try {
      if (key) localStorage.setItem(API_KEY_STORAGE, key);
      else localStorage.removeItem(API_KEY_STORAGE);
    } catch { /* ignore */ }
  },
  getModel(): string | null {
    try {
      return localStorage.getItem(MODEL_STORAGE);
    } catch {
      return null;
    }
  },
  setModel(model: string): void {
    try {
      localStorage.setItem(MODEL_STORAGE, model);
    } catch { /* ignore */ }
  },
  getPersona(): string | null {
    try {
      return localStorage.getItem(PERSONA_STORAGE);
    } catch {
      return null;
    }
  },
  setPersona(persona: string): void {
    try {
      localStorage.setItem(PERSONA_STORAGE, persona);
    } catch { /* ignore */ }
  },
};
