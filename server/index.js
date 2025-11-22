import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { detectAttack } from "./detect.js";
import { saveLog, getLogs } from "./logs.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// basic test route
app.get("/", (req, res) => {
  res.send("Backend working!");
});

app.get("/api/logs", (req, res) => {
  res.json(getLogs());
});

app.post("/trap", (req, res) => {
  const payload = req.body;

  // 1. Detect attack (returns { type: "SQLi" / "XSS" / "HoneypotBot" / "Benign" })
  const detection = detectAttack(payload);

  // 2. Save log with tamper-evident hash chain
  const log = saveLog(payload, detection);

  // 3. If ANY attack → return fake admin panel
  if (detection.type !== "Benign") {
    return res.json({
      status: "success",
      message: "Deception triggered",
      fakeAdmin: true,           // IMPORTANT!
      detection,                 // e.g. { type: "SQLi", score: 95 }
      log                        // full log entry with hash chain
    });
  }

  // 4. Real harmless human
  return res.json({
    status: "success",
    message: "Normal user detected",
    fakeAdmin: false,           // DO NOT SHOW FAKE ADMIN HERE
    detection,
    log
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
