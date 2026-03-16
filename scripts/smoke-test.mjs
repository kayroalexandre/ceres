import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import packageJson from "../package.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const errors = [];
const recipeFiles = [
  "docs/recipes/button.json",
  "docs/recipes/input.json",
  "docs/recipes/card.json",
  "docs/recipes/modal.json",
  "docs/recipes/badge.json",
  "docs/recipes/toast.json"
];
const recipeNames = [
  "button",
  "input",
  "card",
  "modal",
  "badge",
  "toast"
];

async function readJson(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function readText(relativePath) {
  return readFile(path.join(rootDir, relativePath), "utf8");
}

function collectTokenPaths(node, bucket) {
  if (Array.isArray(node)) {
    for (const item of node) {
      collectTokenPaths(item, bucket);
    }
    return;
  }

  if (!node || typeof node !== "object") {
    if (typeof node === "string" && /^[a-z]+(\.[A-Za-z0-9-]+)+$/.test(node)) {
      bucket.add(node);
    }
    return;
  }

  for (const value of Object.values(node)) {
    collectTokenPaths(value, bucket);
  }
}

function collectObjectPaths(node, currentPath, bucket) {
  if (Array.isArray(node) || !node || typeof node !== "object") {
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    const nextPath = [...currentPath, key];
    bucket.add(nextPath.join("."));
    collectObjectPaths(value, nextPath, bucket);
  }
}

async function main() {
  const manifest = await readJson("dist/manifest.json");
  const contract = await readJson("docs/output-manifest.json");

  if (JSON.stringify(manifest) !== JSON.stringify(contract)) {
    errors.push("docs/output-manifest.json e dist/manifest.json divergem.");
  }

  if (manifest.outputs.length !== 6) {
    errors.push(`Manifesto deveria listar 6 combinacoes de tema, mas listou ${manifest.outputs.length}.`);
  }

  for (const output of manifest.outputs) {
    const themeCss = await readText(output.themeCss);
    const tokensJson = await readJson(output.tokensJson);
    const wrapperPath = path.join(rootDir, output.themeCss.replace("theme.css", "index.js"));
    const wrapper = await import(pathToFileURL(wrapperPath).href);
    const runtimeSubpath = `./${output.brand}/${output.mode}`;
    const cssSubpath = `${runtimeSubpath}.css`;
    const jsonSubpath = `${runtimeSubpath}.json`;

    if (output.runtimeModule !== output.themeCss.replace("theme.css", "index.js")) {
      errors.push(`${output.brand}/${output.mode} nao expõe runtimeModule coerente no manifesto.`);
    }

    if (output.packageCssImport !== `@ceres/design-tokens/${output.brand}/${output.mode}.css`) {
      errors.push(`${output.brand}/${output.mode} nao expõe packageCssImport coerente no manifesto.`);
    }

    if (output.packageJsonImport !== `@ceres/design-tokens/${output.brand}/${output.mode}.json`) {
      errors.push(`${output.brand}/${output.mode} nao expõe packageJsonImport coerente no manifesto.`);
    }

    if (output.packageRuntimeImport !== `@ceres/design-tokens/${output.brand}/${output.mode}`) {
      errors.push(`${output.brand}/${output.mode} nao expõe packageRuntimeImport coerente no manifesto.`);
    }

    if (!themeCss.includes("--color-brand:")) {
      errors.push(`${output.themeCss} nao exporta --color-brand.`);
    }

    if (!themeCss.includes("--text-body-md:")) {
      errors.push(`${output.themeCss} nao exporta --text-body-md.`);
    }

    if (!themeCss.includes("--shadow-sm:")) {
      errors.push(`${output.themeCss} nao exporta --shadow-sm.`);
    }

    if (!("color" in tokensJson) || !("typography" in tokensJson) || !("size" in tokensJson)) {
      errors.push(`${output.tokensJson} nao contem os domínios esperados de contrato publico.`);
    }

    if (JSON.stringify(wrapper.default) !== JSON.stringify(tokensJson)) {
      errors.push(`${wrapperPath} nao corresponde ao JSON de ${output.tokensJson}.`);
    }

    if (!(runtimeSubpath in packageJson.exports)) {
      errors.push(`package.json nao expoe o runtime ${runtimeSubpath}.`);
    }

    if (!(cssSubpath in packageJson.exports)) {
      errors.push(`package.json nao expoe o CSS ${cssSubpath}.`);
    }

    if (!(jsonSubpath in packageJson.exports)) {
      errors.push(`package.json nao expoe o JSON ${jsonSubpath}.`);
    }
  }

  const publicLight = await readJson("dist/ceres/light/tokens.json");
  const publicDark = await readJson("dist/ceres/dark/tokens.json");
  const lightPaths = new Set();
  const darkPaths = new Set();
  collectObjectPaths(publicLight, [], lightPaths);
  collectObjectPaths(publicDark, [], darkPaths);

  if (lightPaths.size !== darkPaths.size) {
    errors.push("dist/ceres/light/tokens.json e dist/ceres/dark/tokens.json nao tem a mesma cobertura estrutural.");
  }

  const contractDoc = await readText("docs/public-contract.md");
  if (!contractDoc.includes("## Uso Rapido")) {
    errors.push("docs/public-contract.md nao contem a secao de uso rapido.");
  }

  const manifestWrapper = await import(pathToFileURL(path.join(rootDir, "dist/manifest.js")).href);
  if (JSON.stringify(manifestWrapper.default) !== JSON.stringify(manifest)) {
    errors.push("dist/manifest.js nao corresponde a dist/manifest.json.");
  }

  for (const recipeName of recipeNames) {
    const recipeJson = await readJson(`docs/recipes/${recipeName}.json`);
    const recipeWrapper = await import(pathToFileURL(path.join(rootDir, "dist/recipes", `${recipeName}.js`)).href);

    if (JSON.stringify(recipeWrapper.default) !== JSON.stringify(recipeJson)) {
      errors.push(`dist/recipes/${recipeName}.js nao corresponde a docs/recipes/${recipeName}.json.`);
    }
  }

  const semanticContract = new Set();
  collectObjectPaths(publicLight, [], semanticContract);

  for (const recipeFile of recipeFiles) {
    const recipe = await readJson(recipeFile);
    const referencedTokens = new Set();
    collectTokenPaths(recipe, referencedTokens);

    if (referencedTokens.size === 0) {
      errors.push(`${recipeFile} nao referencia tokens publicos.`);
      continue;
    }

    for (const tokenPath of referencedTokens) {
      if (!semanticContract.has(tokenPath)) {
        errors.push(`${recipeFile} referencia ${tokenPath}, mas esse token nao existe no contrato publico gerado.`);
      }
    }
  }

  const expectedExports = [
    "./manifest",
    "./manifest.json",
    "./contract",
    "./recipes/button",
    "./recipes/input",
    "./recipes/card",
    "./recipes/modal",
    "./recipes/badge",
    "./recipes/toast",
    "./ceres/light",
    "./ceres/light.css",
    "./ceres/light.json",
    "./ceres/dark",
    "./ceres/dark.css",
    "./ceres/dark.json",
    "./eris/light",
    "./eris/light.css",
    "./eris/light.json",
    "./eris/dark",
    "./eris/dark.css",
    "./eris/dark.json",
    "./pluto/light",
    "./pluto/light.css",
    "./pluto/light.json",
    "./pluto/dark",
    "./pluto/dark.css",
    "./pluto/dark.json"
  ];

  for (const exportKey of expectedExports) {
    if (!(exportKey in packageJson.exports)) {
      errors.push(`package.json nao expoe o subpath esperado ${exportKey}.`);
    }
  }

  if (errors.length > 0) {
    console.error("Smoke tests failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Smoke tests passed.");
}

await main();
