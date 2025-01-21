const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let bestScore = null; // zatím žádné nejlepší skóre

// ukládání nejlepšího skóre
app.post("/saveBestScore", (req, res) => {
  const { name, score } = req.body;

  // aktualizuje nejlepší skóre pouze v případě, že je vyšší nebo že nejlepší skóre neexistuje.
  if (!bestScore || score > bestScore.score) {
    bestScore = { name, score };
  }

  res.json({ message: "Best score saved successfully!", bestScore });
});

// Get nejlepší skóre
app.get("/getBestScore", (req, res) => {
  if (!bestScore) {
    res.json({ message: "Zatím žádné nejlepší skóre" });
  } else {
    res.json(bestScore);
  }
});

// Reset nejlepší skóre
app.get("/resetBestScore", (req, res) => {
  bestScore = null; // reset nejlepšího skóre na null
  res.json({ message: "Best score has been reset." });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
