import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const filename = "POST.json";
const postUrl = /^https:\/\/x\.com\/[a-zA-Z0-9_]{1,15}\/status\/[0-9]+$/;

try {
  mkdirSync(outputDir, { recursive: true });
  const bytes = readFileSync(join(botDir, filename));

  let url: unknown;
  try {
    url = JSON.parse(bytes.toString("utf8"))?.url;
  } catch {
    throw new Error("POST.json must contain valid JSON.");
  }

  if (typeof url !== "string" || !postUrl.test(url) || url.trim() !== url) {
    throw new Error("POST.json must name an X post in its url field.");
  }

  writeFileSync(join(outputDir, filename), bytes);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error.";
  console.error(`Could not copy POST.json: ${message}`);
  process.exitCode = 1;
}
