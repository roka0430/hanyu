import { SettingsStorage } from "./modules/settings.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("settings", () => ({
    settings: {},
    defaultSettings: {
      mode: "input",
    },

    init() {
      this.settingsStorage = new SettingsStorage("hanyu:settings");

      this.settings = { ...this.defaultSettings };
      const settings = this.settingsStorage.load(this.defaultSettings);

      for (const [key, value] of Object.entries(settings)) {
        if (key in this.settings) {
          this.settings[key] = value;
        }
      }

      this.$watch(
        () => this.settings,
        () => {
          this.settingsStorage.save(this.settings);
        },
      );
    },
  }));

  Alpine.data("categories", () => ({
    vocabulary: [],

    async init() {
      this.vocabulary = await this.loadVocabulary();
    },

    async loadVocabulary() {
      try {
        const res = await fetch("/api/vocabulary");

        if (!res.ok) {
          throw new Error("Failed to load vocabulary");
        }

        return await res.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  }));
});
