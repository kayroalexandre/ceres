import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { themeDefinitions } from "../style-dictionary.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "docs");
const distDir = path.join(rootDir, "dist");
const recipesDir = path.join(docsDir, "recipes");

function normalizePath(...segments) {
  return path.join(...segments).replaceAll(path.sep, "/");
}

function buildThemeEntry(themeDefinition) {
  const { brand, mode } = themeDefinition;
  const basePath = normalizePath("dist", brand, mode);
  const publicBasePath = `@ceres/design-tokens/${brand}/${mode}`;

  return {
    brand,
    mode,
    themeCss: `${basePath}/theme.css`,
    tokensJson: `${basePath}/tokens.json`,
    runtimeModule: `${basePath}/index.js`,
    packageCssImport: `${publicBasePath}.css`,
    packageJsonImport: `${publicBasePath}.json`,
    packageRuntimeImport: publicBasePath
  };
}

function buildManifest() {
  return {
    publicContract: {
      base: "tokens/semantics/**",
      modeOverrides: "tokens/themes/dark/**"
    },
    outputs: themeDefinitions.map(buildThemeEntry)
  };
}

function createJsModuleSource(value) {
  return `const value = ${JSON.stringify(value, null, 2)};\n\nexport default value;\n`;
}

function createTypesSource(typeName = "Record<string, any>") {
  return `declare const value: ${typeName};\nexport default value;\n`;
}

async function writeThemeWrappers(manifest) {
  for (const output of manifest.outputs) {
    const tokensPath = path.join(rootDir, output.tokensJson);
    const outputDir = path.dirname(tokensPath);
    const raw = await readFile(tokensPath, "utf8");
    const json = JSON.parse(raw);

    await writeFile(path.join(outputDir, "index.js"), createJsModuleSource(json), "utf8");
    await writeFile(path.join(outputDir, "index.d.ts"), createTypesSource(), "utf8");
  }
}

async function writeManifestWrappers(manifest) {
  await writeFile(path.join(distDir, "manifest.js"), createJsModuleSource(manifest), "utf8");
  await writeFile(path.join(distDir, "manifest.d.ts"), createTypesSource(), "utf8");
}

async function writeRecipeWrappers() {
  const recipeNames = [
    "button",
    "input",
    "card",
    "modal",
    "badge",
    "toast"
  ];

  const outputDir = path.join(distDir, "recipes");
  await mkdir(outputDir, { recursive: true });

  for (const recipeName of recipeNames) {
    const raw = await readFile(path.join(recipesDir, `${recipeName}.json`), "utf8");
    const recipe = JSON.parse(raw);

    await writeFile(path.join(outputDir, `${recipeName}.js`), createJsModuleSource(recipe), "utf8");
    await writeFile(path.join(outputDir, `${recipeName}.d.ts`), createTypesSource(), "utf8");
  }
}

async function main() {
  const manifest = buildManifest();

  const payload = `${JSON.stringify(manifest, null, 2)}\n`;

  await mkdir(docsDir, { recursive: true });
  await mkdir(distDir, { recursive: true });

  await writeFile(path.join(docsDir, "output-manifest.json"), payload, "utf8");
  await writeFile(path.join(distDir, "manifest.json"), payload, "utf8");
  await writeThemeWrappers(manifest);
  await writeManifestWrappers(manifest);
  await writeRecipeWrappers();

  console.log("Output manifest and runtime wrappers written to docs/ and dist/.");
}

await main();
