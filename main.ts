import { copyFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

// The grader sets where the entry lives and where its output goes.
// Nothing else is read, and nothing is written anywhere except the
// output directory.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POSTS.json");
const target = join(outputDir, "POSTS.json");

try {
  await mkdir(outputDir, { recursive: true });
  await copyFile(source, target);
  const [sourceBytes, targetBytes] = await Promise.all([
    readFile(source),
    readFile(target),
  ]);
  if (!sourceBytes.equals(targetBytes)) {
    console.error("failed to copy POSTS.json: output differs from source");
    process.exit(1);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`failed to copy POSTS.json: ${message}`);
  process.exit(1);
}
