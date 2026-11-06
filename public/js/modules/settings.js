export class SettingsStorage {
  constructor(storage_key) {
    this.key = storage_key;
  }

  load(defaultValue = null) {
    try {
      const value = localStorage.getItem(this.key);

      if (value === null) {
        return defaultValue;
      }

      return JSON.parse(value);
    } catch (error) {
      console.error(`Failed to load storage: ${error}`);
      return defaultValue;
    }
  }

  save(value) {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save storage: ${error}`);
      return false;
    }
  }
}
