import { SettingsStorage } from "./modules/settings.js";
import { convertPinyin } from "./modules/pinyin.js";

document.addEventListener("alpine:init", () => {
  Alpine.data("study", () => ({
    id: null,
    settings: {},
    words: null,

    answer: "",
    index: 0,

    isAnswerVisible: false,
    isAnswering: true,
    // isAnswerVisible: true,
    // isAnswering: false,

    async init() {
      const params = new URLSearchParams(window.location.search);
      this.id = params.get("id");

      this.settingsStorage = new SettingsStorage("hanyu:settings");
      this.settings = this.settingsStorage.load(this.defaultSettings);

      this.words = await this.loadWords();

      if (this.words === null || this.words.words.length === 0) {
        location.replace("/");
      }
    },

    async loadWords() {
      try {
        const res = await fetch(`/api/vocabulary/${this.id}`);

        if (!res.ok) {
          throw new Error("Failed to load vocabulary");
        }

        return await res.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    get currentWord() {
      return this.words ? this.words.words[this.index] : {};
    },

    convertPinyin(pinyin) {
      if (pinyin) {
        return convertPinyin(pinyin);
      }

      return "";
    },

    keydownInput(e) {
      if (e.key === "Escape") {
        location.replace("/");
        return;
      }

      if (this.isAnswering) {
        if (e.key === "Enter") {
          this.checkAnswer();
        } else if (e.key === "Insert" || e.key === "End") {
          this.revealAnswer();
        }
      } else {
        this.nextWord();
        e.preventDefault();
      }
    },

    checkAnswer() {
      if (this.answer === "") {
        return;
      }

      const pinyin = this.answer.toLowerCase().replace(/ /g, "");
      const answer = this.currentWord.pinyin.toLowerCase().replace(/ /g, "");

      if (pinyin === answer) {
        this.isAnswerVisible = true;
        this.isAnswering = false;
      }

      this.answer = "";
    },

    revealAnswer() {
      this.isAnswerVisible = true;
    },

    nextWord() {
      this.isAnswerVisible = false;
      this.isAnswering = true;
      this.index++;
    },
  }));
});
