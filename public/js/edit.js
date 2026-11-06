document.addEventListener("alpine:init", () => {
  Alpine.data("edit", () => ({
    vocabulary: [],
    words: {},
    currentId: null,
    timeout: null,

    async init() {
      this.vocabulary = await this.loadVocabulary();

      if (this.vocabulary.length > 0) {
        this.selectWords(this.vocabulary[0].id);
      }
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

    async selectWords(id) {
      await this.saveWords();

      this.currentId = id;
      this.words = await this.loadWords();
    },

    async loadWords() {
      try {
        const res = await fetch(`/api/vocabulary/${this.currentId}`);

        if (!res.ok) {
          throw new Error("Failed to load vocabulary");
        }

        return await res.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    async saveWords() {},

    inputTextarea() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => this.saveWords(), 1000);
    },

    get wordsText() {
      if (!this.words.words) {
        return "";
      }

      const output = [];
      for (const word of this.words.words) {
        output.push(Object.values(word).join("；"));
      }

      return output.join("\n");
    },
  }));
});
