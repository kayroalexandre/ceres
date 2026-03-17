# Ceres Design Tokens

Base de Design Tokens agnostica organizada no fluxo `primitives > brand > semantics > theme`, pronta para ser processada pelo Style Dictionary e consumida por qualquer stack. O projeto agora expõe uma API pública clara para frontend, recipes de composição por componente e um exemplo oficial de integração com Tailwind v4.

## Publicação

O pacote esta preparado para publicação no npm público como `@ceres/design-tokens`.

Princípios de distribuição:

- publica apenas artefatos de consumo
- nao publica `tokens/`, `scripts/`, `examples/` nem configuracao de build
- continua agnostico de framework, mesmo tendo Next.js + Tailwind v4 + Framer Motion como cenarios de consumo alvo

Scripts de release:

- `npm run prepack`: executa a cadeia oficial antes do empacotamento
- `npm run pack:check`: inspeciona o tarball final com `npm pack --dry-run`

## Release Automatizada

O repositório inclui workflow de publish em GitHub Actions em `.github/workflows/publish.yml`.

Como configurar:

- no npm, abra as settings do pacote `@ceres/design-tokens`
- em `Trusted publishing`, conecte `GitHub Actions`
- informe `kayroalexandre` como owner/user
- informe `ceres` como repository
- informe `publish.yml` como workflow filename
- o workflow publica automaticamente quando uma tag no formato `v*` e enviada
- o workflow tambem pode ser executado manualmente em `Actions > Publish Package`
- com trusted publishing, nao e necessario armazenar `NPM_TOKEN` no GitHub

Fluxo recomendado de release:

```bash
npm version patch
git push origin main --follow-tags
```

Regra de seguranca do workflow:

- se a tag for `v0.1.1`, o `package.json` precisa estar com `"version": "0.1.1"`
- se os valores divergirem, o publish falha antes de enviar qualquer pacote
- depois de validar o fluxo OIDC, a recomendacao do npm e restringir tokens tradicionais de publish para reduzir superficie de ataque

## Arquitetura

- `tokens/primitives`: foundations brutas do sistema, como paletas base, spacing, radius, fontSize, fontWeight, lineHeight, fontStyle, opacity, blur, motion, layout, layer e escalas dimensionais auxiliares.
- `tokens/brand/<brand>`: camada de branding. Aqui entram a escala `color.brand.*` e `typography.fontFamily.*`.
- `tokens/semantics`: tokens com contexto de uso. Tipografia, size, effect, motion, layout e layer vivem aqui como contrato compartilhado.
- `tokens/themes/dark`: camada de override de modo. A cor semantica base representa o light default, e o dark sobrescreve apenas os tokens que realmente mudam.

## API Publica

Os artefatos oficiais do sistema sao:

- `dist/<brand>/<mode>/theme.css`
- `dist/<brand>/<mode>/tokens.json`
- `dist/<brand>/<mode>/index.js`
- `dist/manifest.json`
- `dist/manifest.js`
- `docs/output-manifest.json`
- `docs/public-contract.md`

Politica oficial de contrato:

- `tokens/semantics/**` = contrato publico base
- `tokens/themes/dark/**` = override publico de modo
- `tokens/primitives/**` e `tokens/brand/**` = internos

O source of truth continua semantico. A abreviacao de nomes acontece apenas na exportacao para DX com Tailwind.

Subpaths públicos de consumo:

- `@ceres/design-tokens/ceres/light`
- `@ceres/design-tokens/ceres/light.css`
- `@ceres/design-tokens/ceres/light.json`
- equivalentes para `ceres/dark`, `eris/light`, `eris/dark`, `pluto/light`, `pluto/dark`
- `@ceres/design-tokens/manifest`
- `@ceres/design-tokens/manifest.json`
- `@ceres/design-tokens/contract`
- `@ceres/design-tokens/recipes/<component>`
- `@ceres/design-tokens/recipes/<component>.json`

## Build e Distribuicao

- O projeto usa `style-dictionary` na linha atual `v5`.
- Nao usa `@tokens-studio/sd-transforms`; o source of truth e o JSON nativo do proprio repositório.
- Dependencia necessaria neste repositório:

```bash
npm install -D style-dictionary
```

- O consumidor do CSS e que deve ter `tailwindcss` v4 no projeto de aplicacao; este repositório de tokens nao instala Tailwind.
- O build gera duas saídas por `brand/mode`:
  - `dist/<brand>/<mode>/theme.css`
  - `dist/<brand>/<mode>/tokens.json`
- O build gera tambem um manifesto simples de outputs:
  - `dist/manifest.json`
  - `docs/output-manifest.json`
- O CSS e gerado em formato misto:
  - `@theme { ... }` para namespaces compatíveis com o Tailwind v4
  - `:root { ... }` para custom properties públicas sem namespace nativo em `@theme`

## Regras

- O projeto privilegia o uso de tokens semanticos e de branding, mas isso e recomendacao de arquitetura, nao uma restricao dura.
- Usar foundations de `primitives` direto no componente nao e o ideal para contexto e manutencao, mas nao e proibido.
- `radius` nao varia por marca: o valor bruto vive apenas em `tokens/primitives/radius.json`.
- `fontFamily` usa os papeis `primary`, `secondary` e `mono`.
- `primary` e recomendado para titulos, subtitulos e destaques.
- `secondary` e recomendado para corpo de texto e demais usos correntes.
- `shadow` vive em `tokens/semantics/effect` como `effect.shadow.*`, mantendo o contrato de efeito consistente com blur e opacity.
- `opacity` e `blur` vivem em `primitives` como escala bruta e sobem para `semantics/effect` apenas quando existe contexto real de uso.
- `motion` vive em `primitives` como escala bruta de duration e easing, e sobe para `semantics/motion` quando vira contrato de uso, como hover, dialog e page transition.
- `layout`, `layer`, `borderWidth`, `componentHeight` e `icon-size` seguem a mesma logica: escala bruta em `primitives` e contratos de uso em `semantics`.
- `overlay` e `state-layer` entram em `semantics/color` e podem ser sobrescritos por modo no `dark` quando a leitura visual pedir outro comportamento.
- O contrato publico do build vem apenas de `tokens/semantics/**` e `tokens/themes/dark/**`.
- `primitives` e `brand` entram na composicao do tema, mas nao sao exportados como API publica final.

## Brands

- `ceres`: marca padrao, com escala `color.brand.*` baseada em `color.blue.*` e `fontFamily.primary/secondary` em Inter.
- `eris`: marca com escala `color.brand.*` baseada em `color.orange.*`.
- `pluto`: marca com escala `color.brand.*` baseada em `color.rose.*`.

## Integração com Tailwind v4

Instalacao esperada no app consumidor:

```bash
npm install @ceres/design-tokens
```

Uso em `app/globals.css` de um projeto Next.js:

```css
@import "tailwindcss";
@import "@ceres/design-tokens/ceres/light.css";
```

O build usa mapeamento automático com base nos paths públicos reais dos tokens:

- `color.background.surface.default` -> `--color-surface` -> `bg-surface`
- `color.background.brand.default` -> `--color-brand` -> `bg-brand`
- `color.content.primary` -> `--color-content-primary` -> `text-content-primary`
- `color.foreground.default` -> `--color-icon` -> `fill-icon` ou `text-icon`
- `color.action.primary.background` -> `--color-action-primary` -> `bg-action-primary`
- `color.feedback.success.foreground` -> `--color-on-success` -> `text-on-success`
- `color.border.subtle` -> `--color-line-subtle` -> `border-line-subtle`
- `typography.*.fontFamily` -> `--font-*`
- `typography.*.size*` -> `--text-*`
- `typography.*.letterSpacing` -> `--tracking-*`
- `typography.*.lineHeight` -> `--leading-*`
- `size.spacing.*` -> `--spacing-*`
- `size.radius.*` -> `--radius-*`
- `effect.shadow.*` -> `--shadow-*`
- `effect.blur.*` -> `--blur-*`
- `motion.easing.*` -> `--ease-*`
- `layout.breakpoint.*` -> `--breakpoint-*`
- `layout.container.*` -> `--container-*`

Grupos sem namespace oficial em `@theme` continuam no mesmo `theme.css` como custom properties publicas comuns:

- `effect.opacity.*`
- `layer.zIndex.*`
- `motion.duration.*`
- `motion.transition.*`
- `layout.grid.*`
- `size.borderWidth.*`
- `size.componentHeight.*`
- `size.icon.*`

Exemplo minimo oficial:

- `examples/tailwind-v4/app.css`
- `examples/tailwind-v4/index.html`
- `examples/tailwind-v4/README.md`

## Consumo em TypeScript e Framer Motion

O pacote tambem expõe wrappers JS leves para evitar atrito com import de JSON em runtime:

```ts
import tokens from "@ceres/design-tokens/ceres/light";
import manifest from "@ceres/design-tokens/manifest";
```

Exemplo de uso com motion no app consumidor:

```ts
import tokens from "@ceres/design-tokens/ceres/light";

const transition = {
  duration: Number.parseFloat(tokens.motion.duration.fast) / 1000,
  ease: tokens.motion.transition.hover.easing
};
```

O repositório nao instala nem depende de Framer Motion; ele apenas expõe os valores de motion de forma segura para consumo.

## Recipes de Componentes

Recipes de composicao vivem fora de `tokens/` e usam apenas paths publicos do contrato:

- `docs/recipes/button.json`
- `docs/recipes/input.json`
- `docs/recipes/card.json`
- `docs/recipes/modal.json`
- `docs/recipes/badge.json`
- `docs/recipes/toast.json`

Esses arquivos respondem “quais tokens usar em um componente real?” sem transformar recipes em foundations do sistema.

Subpaths equivalentes para runtime:

- `@ceres/design-tokens/recipes/button`
- `@ceres/design-tokens/recipes/input`
- `@ceres/design-tokens/recipes/card`
- `@ceres/design-tokens/recipes/modal`
- `@ceres/design-tokens/recipes/badge`
- `@ceres/design-tokens/recipes/toast`

## Uso Pratico de Tokens

- Use `content.*` para texto e `foreground.*` para icones, affordances e sinais graficos.
- Use `action.*` quando o componente realmente muda a superficie de fundo por variante ou estado.
- Use `stateLayer.*` quando o componente mantem a superficie base e recebe uma camada de interacao por cima.
- Use `overlay.subtle` para foco leve em background e `overlay.scrim` para bloqueio mais forte em modais e drawers.
- Para `focus`, combine `stateLayer.focus.*` com `border.brand.default` ou `line-brand` no consumidor.
- Para `disabled`, prefira os tokens explicitos de `action.disabled`, `content.disabled` e `foreground.disabled`.
- Para `selected`, prefira `stateLayer.selected.*` somado a border ou content de maior contraste quando necessario.

## Scripts e Qualidade

- `npm run validate`: valida JSON, referencias existentes e contratos compartilhados entre brands, alem da consistencia estrutural dos arquivos de override de modo quando existirem.
- `npm run build`: gera saidas CSS e JSON por marca/modo em `dist/` e atualiza os manifestos de output.
- `npm run contract`: gera `docs/public-contract.md` com o inventario do contrato publico derivado de `semantics` e dos overrides de `dark`.
- `npm run smoke`: executa smoke tests sobre os artefatos, manifestos e recipes.
- `npm run check`: executa validacao, build, contrato publico e smoke tests.
- `npm run pack:check`: verifica o shape final do pacote publicado sem publicar.

## Governanca

- A validacao trata `themes` como override do contrato publico, nao como uma segunda fonte independente de paths.
- Se `dark` tentar sobrescrever um token que nao existe em `semantics`, a validacao falha.
- Se `themes` sobrescrever algo fora de `color.*` ou usar valor bruto, a validacao apenas alerta; isso continua como recomendacao arquitetural, nao como bloqueio duro.
- O contrato publico pode ser materializado em `docs/public-contract.md`, o que ajuda revisao, versionamento e consumo por outras equipes.
- O manifesto de output formaliza quais combinacoes de brand/mode existem e onde seus artefatos publicos estao.

## Saida gerada

Cada composicao final e exportada em:

- `dist/<brand>/<mode>/theme.css`
- `dist/<brand>/<mode>/tokens.json`
- `dist/<brand>/<mode>/index.js`
- `dist/manifest.json`
- `dist/manifest.js`
- `docs/output-manifest.json`

O CSS usa `@theme` para os grupos compatíveis com o Tailwind v4 e custom properties normais para o restante do contrato publico. Isso evita gerar um `tailwind.config.js` e mantém o contrato dos tokens desacoplado do framework.

Na saida final, o contrato publico e exportado a partir de `semantics + themes`, sem expor automaticamente toda a camada `primitives` ou `brand`. O light usa diretamente a semantica como base, e o dark entra apenas como override.

### Exemplo Real

Token público:

```json
{
  "color": {
    "background": {
      "brand": {
        "default": {
          "value": "{color.brand.500}"
        }
      }
    }
  }
}
```

Saída no `theme.css`:

```css
@theme {
  --color-brand: #3b82f6;
}
```

Uso previsto no Tailwind v4:

```html
<div class="bg-brand"></div>
```

Observacao: o source of truth continua semantico. O encurtamento acontece apenas na exportacao para Tailwind, preservando os paths internos do repositório.

## Composicao de build

Cada tema final combina:

- `tokens/primitives/**/*.json`
- `tokens/brand/<brand>/**/*.json`
- `tokens/semantics/**/*.json`
- `tokens/themes/dark/**/*.json`

Exemplo:

- `ceres + light`: `primitives + brand + semantics`
- `ceres + dark`: `primitives + brand + semantics + themes/dark`
- `eris + light`: `primitives + brand + semantics`
- `eris + dark`: `primitives + brand + semantics + themes/dark`
- `pluto + light`: `primitives + brand + semantics`
- `pluto + dark`: `primitives + brand + semantics + themes/dark`
