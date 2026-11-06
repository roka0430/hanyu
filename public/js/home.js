import { SettingsStorage } from "./modules/settings.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("settings", () => ({
    settings: {},

    init() {
      this.settingsStorage = new SettingsStorage("hanyu:settings");
      this.settings = this.settingsStorage.load(this.defaultSettings);

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
