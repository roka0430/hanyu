import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
