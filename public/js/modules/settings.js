export class SettingsStorage {
  constructor(storage_key) {
    this.key = storage_key;

    this.defaultSettings = {
      mode: "input",
      speak: false,
    };
  }

  load() {
    try {
      const value = localStorage.getItem(this.key);

      if (value === null) {
        return this.defaultSettings;
      }

      const settings = { ...this.defaultSettings };
      const localSettings = JSON.parse(value);

      for (const [key, value] of Object.entries(localSettings)) {
        if (key in settings) {
          settings[key] = value;
        }
      }

      return settings;
    } catch (error) {
      console.error(`Failed to load storage: ${error}`);
      return this.defaultSettings;
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
