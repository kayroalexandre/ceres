import StyleDictionary from "style-dictionary";
import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  createStyleDictionaryConfig,
  registerStyleDictionaryFormats,
  themeDefinitions
} from "../style-dictionary.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execFileAsync = promisify(execFile);

registerStyleDictionaryFormats(StyleDictionary);

for (const themeDefinition of themeDefinitions) {
  const sd = new StyleDictionary(createStyleDictionaryConfig(themeDefinition));
  await sd.buildAllPlatforms();
}

await execFileAsync(process.execPath, [path.join(__dirname, "generate-output-manifest.mjs")], {
  cwd: path.resolve(__dirname, "..")
});
