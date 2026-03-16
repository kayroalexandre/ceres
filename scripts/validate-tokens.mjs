import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const tokensDir = path.join(rootDir, "tokens");

const errors = [];
const warnings = [];
const tokenRegistry = new Map();
const brandContracts = new Map();
const themeModeContracts = new Map();
const semanticContracts = new Set();
const themeOverrides = new Map();

const ALIAS_PATTERN = /^\{([A-Za-z0-9._-]+)\}$/;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(resolved) : [resolved];
    })
  );

  return results.flat();
}

function getLayer(filePath) {
  const relativePath = path.relative(tokensDir, filePath);
  const [layer] = relativePath.split(path.sep);
  return layer;
}

function getThemeMode(filePath) {
  const relativePath = path.relative(path.join(tokensDir, "themes"), filePath);
  const [mode] = relativePath.split(path.sep);
  return mode;
}

function trackTokenPaths(node, currentPath, filePath, layer) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    return;
  }

  if (Object.hasOwn(node, "value")) {
    const tokenPath = currentPath.join(".");

    if (!tokenRegistry.has(tokenPath)) {
      tokenRegistry.set(tokenPath, []);
    }

    tokenRegistry.get(tokenPath).push({
      value: node.value,
      filePath,
      layer
    });

    if (layer === "brand") {
      const relativePath = path.relative(path.join(tokensDir, "brand"), filePath);
      const [brandName] = relativePath.split(path.sep);

      if (!brandContracts.has(brandName)) {
        brandContracts.set(brandName, new Set());
      }

      brandContracts.get(brandName).add(tokenPath);
    }

    if (layer === "semantics") {
      semanticContracts.add(tokenPath);
    }

    if (layer === "themes") {
      const mode = getThemeMode(filePath);

      if (!themeModeContracts.has(mode)) {
        themeModeContracts.set(mode, new Set());
      }

      themeModeContracts.get(mode).add(tokenPath);

      if (!themeOverrides.has(mode)) {
        themeOverrides.set(mode, []);
      }

      themeOverrides.get(mode).push({
        filePath,
        tokenPath,
        value: node.value
      });
    }

    return;
  }

  for (const [key, value] of Object.entries(node)) {
    trackTokenPaths(value, [...currentPath, key], filePath, layer);
  }
}

function findTarget(targetPath, allowedLayers) {
  const entries = tokenRegistry.get(targetPath) ?? [];
  return entries.find((entry) => allowedLayers.includes(entry.layer));
}

function validateReferences() {
  for (const [tokenPath, entries] of tokenRegistry.entries()) {
    for (const entry of entries) {
      const match = typeof entry.value === "string" ? entry.value.match(ALIAS_PATTERN) : null;

      if (!match) {
        continue;
      }

      const [, targetPath] = match;

      const target = findTarget(targetPath, ["primitives", "brand", "semantics", "themes"]);

      if (!target) {
        errors.push(
          `${tokenPath} em ${path.relative(rootDir, entry.filePath)} referencia ${targetPath}, mas o alvo nao existe.`
        );
      }
    }
  }
}

function validateBrandContracts() {
  if (brandContracts.size <= 1) {
    return;
  }

  const brandEntries = [...brandContracts.entries()];
  const [baselineBrandName, baselineTokens] = brandEntries[0];
  const baselineSignature = [...baselineTokens].sort().join("\n");

  for (const [brandName, tokenSet] of brandEntries.slice(1)) {
    const signature = [...tokenSet].sort().join("\n");

    if (signature !== baselineSignature) {
      errors.push(
        `${brandName} nao expoe o mesmo contrato de ${baselineBrandName}. Todas as brands devem definir as mesmas chaves em tokens/brand.`
      );
    }
  }
}

function validateThemeContracts() {
  for (const [modeName, overrides] of themeOverrides.entries()) {
    for (const override of overrides) {
      if (!semanticContracts.has(override.tokenPath)) {
        errors.push(
          `${modeName} sobrescreve ${override.tokenPath} em ${path.relative(rootDir, override.filePath)}, mas esse token nao existe na camada semantics.`
        );
      }

      if (!override.tokenPath.startsWith("color.")) {
        warnings.push(
          `${modeName} esta sobrescrevendo ${override.tokenPath} em ${path.relative(rootDir, override.filePath)}. Hoje a recomendacao do projeto e manter themes apenas para cor.`
        );
      }

      if (typeof override.value !== "string" || !ALIAS_PATTERN.test(override.value)) {
        warnings.push(
          `${modeName} define ${override.tokenPath} em ${path.relative(rootDir, override.filePath)} com valor nao-alias. Isso e permitido, mas foge da recomendacao atual de usar aliases em overrides de theme.`
        );
      }
    }
  }
}

async function main() {
  const files = (await walk(tokensDir)).filter((filePath) => filePath.endsWith(".json")).sort();

  for (const filePath of files) {
    let json;

    try {
      const raw = await readFile(filePath, "utf8");
      json = JSON.parse(raw);
    } catch (error) {
      errors.push(`Falha ao ler ${path.relative(rootDir, filePath)}: ${error.message}`);
      continue;
    }

    const layer = getLayer(filePath);

    trackTokenPaths(json, [], filePath, layer);
  }

  validateReferences();
  validateBrandContracts();
  validateThemeContracts();

  if (errors.length > 0) {
    console.error("Token validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Token validation passed.");
  console.log(`- tokens mapeados: ${tokenRegistry.size}`);
  console.log(`- contrato semantico publico: ${semanticContracts.size}`);
  console.log(`- brands validadas: ${brandContracts.size}`);
  console.log(`- modos com overrides: ${themeOverrides.size}`);

  if (warnings.length > 0) {
    console.warn("\nValidation warnings:\n");
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
  }
}

await main();
