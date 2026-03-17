import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const tokensDir = path.join(rootDir, "tokens");
const outputDir = path.join(rootDir, "docs");
const outputFile = path.join(outputDir, "public-contract.md");

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

function relativeFromRoot(filePath) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, "/");
}

function trackTokens(node, currentPath, filePath, bucket) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    return;
  }

  if (Object.hasOwn(node, "value")) {
    bucket.push({
      path: currentPath.join("."),
      description: typeof node.description === "string" ? node.description : "",
      filePath: relativeFromRoot(filePath),
      value: node.value
    });
    return;
  }

  for (const [key, value] of Object.entries(node)) {
    trackTokens(value, [...currentPath, key], filePath, bucket);
  }
}

function groupByRoot(tokens) {
  const groups = new Map();

  for (const token of tokens) {
    const root = token.path.split(".")[0];

    if (!groups.has(root)) {
      groups.set(root, []);
    }

    groups.get(root).push(token);
  }

  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function renderTokenList(tokens) {
  return tokens
    .sort((left, right) => left.path.localeCompare(right.path))
    .map((token) => {
      const description = token.description ? ` - ${token.description}` : "";
      return `- \`${token.path}\`${description}`;
    })
    .join("\n");
}

function renderQuickUseSection() {
  return [
    "## Uso Rapido",
    "",
    "### Color",
    "",
    "- `color.background.brand.default` -> `--color-brand` -> `bg-brand`",
    "- `color.content.primary` -> `--color-content-primary` -> `text-content-primary`",
    "- `color.border.subtle` -> `--color-line-subtle` -> `border-line-subtle`",
    "- `color.feedback.success.foreground` -> `--color-on-success` -> `text-on-success`",
    "- `color.material.glass.surface` -> `--color-material-glass-surface` -> `bg-material-glass-surface`",
    "",
    "### Typography",
    "",
    "- `typography.body.body.sizeMedium` -> `--text-body-md` -> `text-body-md`",
    "- `typography.title.page.sizeBase` -> `--text-title-page` -> `text-title-page`",
    "- `typography.body.body.fontFamily` -> `--font-body` -> `font-body`",
    "",
    "### Effects, Motion and Layout",
    "",
    "- `effect.shadow.md` -> `--shadow-md` -> `shadow-md`",
    "- `effect.blur.surface.glass` -> `--blur-surface-glass` -> `backdrop-blur-[var(--blur-surface-glass)]`",
    "- `size.radius.surface.md` -> `--radius-surface-md` -> `rounded-surface-md`",
    "- `layout.container.page` -> `--container-page` -> `max-w-page`",
    "- `motion.transition.press.duration` -> `var(--motion-transition-press-duration)` em classes arbitrarias",
    ""
  ].join("\n");
}

async function main() {
  const files = (await walk(tokensDir)).filter((filePath) => filePath.endsWith(".json")).sort();
  const semanticTokens = [];
  const darkOverrides = [];

  for (const filePath of files) {
    const raw = await readFile(filePath, "utf8");
    const json = JSON.parse(raw);
    const normalized = relativeFromRoot(filePath);

    if (normalized.startsWith("tokens/semantics/")) {
      trackTokens(json, [], filePath, semanticTokens);
    }

    if (normalized.startsWith("tokens/themes/dark/")) {
      trackTokens(json, [], filePath, darkOverrides);
    }
  }

  const sections = [
    "# Public Contract",
    "",
    "Documento gerado a partir do source of truth do repositório.",
    "",
    "## Escopo",
    "",
    "- Contrato publico base: `tokens/semantics/**`",
    "- Overrides de modo: `tokens/themes/dark/**`",
    "- Camadas internas: `tokens/primitives/**` e `tokens/brand/**`",
    "",
    "## Resumo",
    "",
    `- Tokens semanticos publicos: ${semanticTokens.length}`,
    `- Overrides dark: ${darkOverrides.length}`,
    "",
    renderQuickUseSection(),
    "",
    "## Contrato Base",
    ""
  ];

  for (const [group, tokens] of groupByRoot(semanticTokens)) {
    sections.push(`### ${group}`);
    sections.push("");
    sections.push(renderTokenList(tokens));
    sections.push("");
  }

  sections.push("## Overrides Dark");
  sections.push("");

  if (darkOverrides.length === 0) {
    sections.push("- Nenhum override registrado.");
  } else {
    sections.push(renderTokenList(darkOverrides));
  }

  sections.push("");
  sections.push("## Observacoes");
  sections.push("");
  sections.push("- O modo light e o baseline semantico do sistema.");
  sections.push("- O dark nao cria contrato novo; apenas sobrescreve paths publicos existentes.");
  sections.push("- O build exporta esses mesmos paths para `theme.css` e `tokens.json` por brand/mode.");
  sections.push("");

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${sections.join("\n")}\n`, "utf8");

  console.log(`Public contract written to ${path.relative(rootDir, outputFile)}.`);
}

await main();
