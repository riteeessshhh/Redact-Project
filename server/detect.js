
export function detectAttack(payload) {
  const text = JSON.stringify(payload).toLowerCase();

  // Basic XSS detection
  const isXSS = /<script|onerror=|javascript:/.test(text);

  // Basic SQL injection detection
  const isSQLi = /(or\s+1=1|union\s+select|--|;|drop\s+table|insert\s+into)/.test(text);

  // Honeypot detection (hidden field)
  const isHoneypot = payload.hp_field && payload.hp_field.trim() !== "";

  if (isXSS) return { type: "XSS", score: 90 };
  if (isSQLi) return { type: "SQLi", score: 95 };
  if (isHoneypot) return { type: "HoneypotBot", score: 70 };

  return { type: "Benign", score: 10 };
}
