import express from "express";
import { getProgress } from "./fetch.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

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
