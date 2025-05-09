import express from "express";
import { getProgress } from "./fetch.js";

const app = express();
const PORT = 3000;

// Serve the "/" endpoint with a visual representation
app.get("/", async (req, res) => {
  try {
    const progress = await getProgress();
    res.send(`
      <h1>Project Progress</h1>
      <p>Completed Items: ${progress.completedItems}</p>
      <p>Total Points Available: ${progress.totalPointsAvailable}</p>
      <p>Total Points Earned: ${progress.totalPointsAvailableForCompletedItems}</p>
      <p>Percentage Points Earned: ${progress.percentagePointsEarned}%</p>
    `);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Serve the "/.json" endpoint with raw JSON data
app.get("/.json", async (req, res) => {
  try {
    const progress = await getProgress();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
