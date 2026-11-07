import express from "express";
import { readFile, writeFile } from "node:fs/promises";

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

app.post("/api/vocabulary/new", async (req, res) => {
  const { name } = req.body;

  const vocabulary = JSON.parse(await readFile("./data/vocabulary.json", "utf8"));
  const idList = vocabulary.map(({ id }) => id);

  let id = 0;
  while (idList.includes(id)) {
    id++;
  }

  const newWords = {
    id: id,
    name: name,
    words: [],
  };

  vocabulary.push(newWords);

  await writeFile("./data/vocabulary.json", JSON.stringify(vocabulary, null, 2), "utf-8");

  res.json(newWords);
});

app.post("/api/vocabulary/:id", async (req, res) => {
  const id = Number(req.params.id);
  const words = req.body;

  const vocabulary = JSON.parse(await readFile("./data/vocabulary.json", "utf8"));
  const wordsIndex = vocabulary.findIndex((vocab) => vocab.id === id);

  vocabulary[wordsIndex].name = words.name;
  vocabulary[wordsIndex].words = words.words;

  await writeFile("./data/vocabulary.json", JSON.stringify(vocabulary, null, 2), "utf-8");

  res.json({ message: "success" });
});

app.delete("/api/vocabulary/:id", async (req, res) => {
  const id = Number(req.params.id);

  const vocabulary = JSON.parse(await readFile("./data/vocabulary.json", "utf8"));

  const updatedVocabulary = vocabulary.filter((vocab) => vocab.id !== id);

  await writeFile("./data/vocabulary.json", JSON.stringify(updatedVocabulary, null, 2), "utf-8");

  res.json({ message: "success" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
