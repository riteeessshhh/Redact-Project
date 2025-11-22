
import crypto from "crypto";

let logs = [];
let lastHash = "";

export function saveLog(payload, detection) {
  const time = new Date().toISOString();

  const entry = {
    time,
    payload,
    detection,
    prevHash: lastHash
  };

  // Hash of this entry
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(entry))
    .digest("hex");

  entry.hash = hash;
  lastHash = hash;

  logs.push(entry);
  return entry;
}

export function getLogs() {
  return logs;
}
