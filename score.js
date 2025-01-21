const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Use a flag or null to indicate no best score
let bestScore = null; // No best score yet

// Save best score
app.post("/saveBestScore", (req, res) => {
  const { name, score } = req.body;

  // Update the best score only if it's higher or there is no best score
  if (!bestScore || score > bestScore.score) {
    bestScore = { name, score };
  }

  res.json({ message: "Best score saved successfully!", bestScore });
});

// Get best score
app.get("/getBestScore", (req, res) => {
  if (!bestScore) {
    res.json({ message: "No best score yet!" });
  } else {
    res.json(bestScore);
  }
});

// Reset best score
app.get("/resetBestScore", (req, res) => {
  bestScore = null; // Reset the best score to null
  res.json({ message: "Best score has been reset." });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
