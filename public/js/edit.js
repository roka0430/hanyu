document.addEventListener("alpine:init", () => {
  Alpine.data("edit", () => ({
    vocabulary: [],
    words: {},
    currentId: null,
    timeout: null,
    textarea: "",

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
      if (id === this.currentId) {
        return;
      }

      if (Object.keys(this.words).length > 0) {
        await this.saveWords();
      }

      this.currentId = id;
      this.words = await this.loadWords();
      this.textarea = this.wordsText;
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

    async saveWords() {
      const words = [];

      for (const line of this.textarea.split("\n").filter(Boolean)) {
        const [ja, cn, pinyin] = [...line.split("；"), "", "", ""];
        words.push({ ja, cn, pinyin });
      }

      this.words.words = words;

      try {
        const res = await fetch(`/api/vocabulary/${this.currentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.words),
        });

        if (!res.ok) {
          throw new Error("Failed to save words");
        }

        return await res.json();
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    inputTextarea() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => this.saveWords(), 1000);
    },

    get wordsText() {
      if (Object.keys(this.words).length === 0) {
        return "";
      }

      const output = [];

      for (const word of this.words.words) {
        output.push(Object.values(word).join("；"));
      }

      return output.join("\n");
    },

    renameWords(id) {
      const newName = prompt("新しい名前を入力してください");

      if (newName.trim() === "") {
        return;
      }

      this.selectWords(id);
      this.words.name = newName;

      const vocab = this.vocabulary.find((vocab) => vocab.id === id);
      if (vocab) {
        vocab.name = newName;
      }

      this.saveWords();
    },
  }));
});
