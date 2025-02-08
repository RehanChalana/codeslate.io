import express from "express";
import cors from "cors";
import axios from "axios";
import http from "http"; 
import { keys } from "./keys.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

const LINK = `${keys.url}/`;
// const LINK = "http://localhost:2358/"

// 🟢 Supported Languages & Judge0 Language IDs
const LANGUAGES = {
  javascript: { language_id: 63 }, // Node.js
  python: { language_id: 71 }, // Python
  c: { language_id: 50 }, // C
  java: { language_id: 62 }, // Java
  cpp: { language_id: 54 }, // C++
};


// 🟢 Code Execution Route
app.post("/execute", async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    if (!LANGUAGES[language]) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const payload = {
      language_id: LANGUAGES[language].language_id,
      source_code: code,
      stdin: stdin || "",
      base64_encoded: false,
    };

    const response = await axios.post(
      `${LINK}submissions?base64_encoded=false&wait=true`,
      payload
    );

    const result = response.data;

    const resultData = {
      output: result.stdout || result.compile_output || result.stderr || "No output",
      time: result.time || "N/A",
      memory: result.memory || "N/A",
      status: result.status.description || "Unknown status",
    };

    res.json(resultData);
  } catch (err) {
    console.error("Internal Server Error:", err);

    if (err.response) {
      return res.status(err.response.status).json({
        error: `Judge0 API Error: ${err.response.data.error || err.response.statusText}`,
      });
    }

    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
