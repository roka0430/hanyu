import express from "express";
import { readFile } from "node:fs/promises";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/api/vocabulary", async (req, res) => {
  const vocabulary = JSON.parse(await readFile("./data/vocabulary.json", "utf8"));
  res.json(vocabulary.map(({ id, name, words }) => ({ id, name, count: words.length })));
});

app.get("/api/vocabulary/:id", async (req, res) => {
  const id = Number(req.params.id);

  const vocabulary = JSON.parse(await readFile("./data/vocabulary.json", "utf8"));
  const words = vocabulary.find((vocab) => vocab.id === id);

  if (!words) {
    return res.status(404).json({ error: "Vocabulary not found" });
  }

  res.json(words);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
