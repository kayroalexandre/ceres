let hasRegisteredFormats = false;

export const themeDefinitions = [
  {
    brand: "ceres",
    mode: "light",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/ceres/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: []
  },
  {
    brand: "ceres",
    mode: "dark",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/ceres/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: [
      "tokens/themes/dark/**/*.json"
    ]
  },
  {
    brand: "eris",
    mode: "light",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/eris/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: []
  },
  {
    brand: "eris",
    mode: "dark",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/eris/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: [
      "tokens/themes/dark/**/*.json"
    ]
  },
  {
    brand: "pluto",
    mode: "light",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/pluto/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: []
  },
  {
    brand: "pluto",
    mode: "dark",
    includes: [
      "tokens/primitives/**/*.json",
      "tokens/brand/pluto/**/*.json",
      "tokens/semantics/**/*.json"
    ],
    sources: [
      "tokens/themes/dark/**/*.json"
    ]
  }
];

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function buildVariableName(namespace, pathParts) {
  const suffix = pathParts.map(toKebabCase).filter(Boolean).join("-");
  return suffix ? `--${namespace}-${suffix}` : `--${namespace}`;
}

function compactAdjacentSegments(segments) {
  const compacted = [];

  for (const segment of segments) {
    if (!segment) {
      continue;
    }

    const normalized = toKebabCase(segment);
    if (compacted.at(-1) !== normalized) {
      compacted.push(normalized);
    }
  }

  return compacted;
}

function getTypographySizeSuffix(segment) {
  if (segment === "size" || segment === "sizeBase") {
    return null;
  }

  if (segment === "sizeSmall") {
    return "sm";
  }

  if (segment === "sizeMedium") {
    return "md";
  }

  if (segment === "sizeLarge") {
    return "lg";
  }

  return toKebabCase(segment);
}

function getColorExportSegments(role, rawSegments) {
  const segments = [...rawSegments];

  if (segments.at(-1) === "color") {
    segments.pop();
  }

  if (segments.at(-1) === "default") {
    segments.pop();
  }

  if (role === "action") {
    if (segments.at(-1) === "background") {
      segments.pop();
      return compactAdjacentSegments(["action", ...segments]);
    } else if (segments.at(-1) === "background-hover") {
      segments.pop();
      segments.push("hover");
      return compactAdjacentSegments(["action", ...segments]);
    } else if (segments.at(-1) === "foreground") {
      segments.pop();
      return compactAdjacentSegments(["on", "action", ...segments]);
    }
  }

  if (role === "background") {
    return compactAdjacentSegments(segments);
  }

  if (role === "border") {
    return compactAdjacentSegments(["line", ...segments]);
  }

  if (role === "content") {
    return compactAdjacentSegments(["content", ...segments]);
  }

  if (role === "feedback") {
    if (segments.at(-1) === "background") {
      segments.pop();
      return compactAdjacentSegments(segments);
    }

    if (segments.at(-1) === "border") {
      const status = segments.slice(0, -1);
      return compactAdjacentSegments(["line", ...status]);
    }

    if (segments.at(-1) === "foreground") {
      const status = segments.slice(0, -1);
      return compactAdjacentSegments(["on", ...status]);
    }
  }

  if (role === "foreground") {
    return compactAdjacentSegments(["icon", ...segments]);
  }

  if (role === "overlay") {
    return compactAdjacentSegments(["overlay", ...segments]);
  }

  if (role === "stateLayer") {
    return compactAdjacentSegments(["state", ...segments]);
  }

  return compactAdjacentSegments([role, ...segments]);
}

function getThemeVariableName(path) {
  const [group, subgroup, ...rest] = path;
  const lastSegment = path.at(-1);

  if (group === "color") {
    if (lastSegment === "opacity") {
      return null;
    }

    return buildVariableName("color", getColorExportSegments(subgroup, rest));
  }

  if (group === "typography") {
    if (subgroup === "letterSpacing") {
      return buildVariableName("tracking", compactAdjacentSegments(rest));
    }

    if (subgroup === "lineHeight") {
      return buildVariableName("leading", compactAdjacentSegments(rest));
    }

    if (lastSegment === "fontFamily") {
      return buildVariableName("font", compactAdjacentSegments(path.slice(1, -1)));
    }

    if (lastSegment.startsWith("size")) {
      const suffix = getTypographySizeSuffix(lastSegment);
      const textPath = compactAdjacentSegments(path.slice(1, -1));

      if (suffix) {
        textPath.push(suffix);
      }

      return buildVariableName("text", textPath);
    }

    return null;
  }

  if (group === "size" && subgroup === "spacing") {
    return buildVariableName("spacing", rest);
  }

  if (group === "size" && subgroup === "radius") {
    return buildVariableName("radius", rest);
  }

  if (group === "effect" && subgroup === "shadow") {
    return buildVariableName("shadow", rest);
  }

  if (group === "effect" && subgroup === "blur") {
    return buildVariableName("blur", rest);
  }

  if (group === "motion" && subgroup === "easing") {
    return buildVariableName("ease", rest);
  }

  if (group === "layout" && subgroup === "breakpoint") {
    return buildVariableName("breakpoint", rest);
  }

  if (group === "layout" && subgroup === "container") {
    return buildVariableName("container", rest);
  }

  return null;
}

function getFallbackVariableName(path) {
  return `--${path.map(toKebabCase).join("-")}`;
}

function getSortedTokens(dictionary) {
  return [...dictionary.allTokens].sort((left, right) => left.path.join(".").localeCompare(right.path.join(".")));
}

export function registerStyleDictionaryFormats(StyleDictionary) {
  if (hasRegisteredFormats) {
    return;
  }

  StyleDictionary.registerFormat({
    name: "cerex/tailwind-theme",
    format: ({ dictionary }) => {
      const themeVariables = [];
      const fallbackVariables = [];

      for (const token of getSortedTokens(dictionary)) {
        const themeVariableName = getThemeVariableName(token.path);

        if (themeVariableName) {
          themeVariables.push(`  ${themeVariableName}: ${token.value};`);
          continue;
        }

        fallbackVariables.push(`  ${getFallbackVariableName(token.path)}: ${token.value};`);
      }

      const sections = [];

      if (themeVariables.length > 0) {
        sections.push(`@theme {\n${themeVariables.join("\n")}\n}`);
      }

      if (fallbackVariables.length > 0) {
        sections.push(`:root {\n${fallbackVariables.join("\n")}\n}`);
      }

      return `${sections.join("\n\n")}\n`;
    }
  });

  hasRegisteredFormats = true;
}

export function createStyleDictionaryConfig(themeDefinition) {
  const { brand, mode, includes, sources } = themeDefinition;

  return {
    include: includes,
    ...(sources.length > 0 ? { source: sources } : {}),
    hooks: {
      filters: {
        "public-tokens": (token) => {
          const filePath = String(token.filePath ?? "").replaceAll("\\", "/");
          return filePath.includes("tokens/semantics/") || filePath.includes("tokens/themes/");
        }
      }
    },
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: `dist/${brand}/${mode}/`,
        files: [
          {
            destination: "theme.css",
            format: "cerex/tailwind-theme",
            filter: "public-tokens"
          }
        ]
      },
      json: {
        transformGroup: "js",
        buildPath: `dist/${brand}/${mode}/`,
        files: [
          {
            destination: "tokens.json",
            format: "json/nested",
            filter: "public-tokens"
          }
        ]
      }
    }
  };
}
