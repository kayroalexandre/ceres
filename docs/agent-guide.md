# Ceres Agent Guide

Guia publico de implementacao para consumidores humanos e assistentes de IA.

Objetivo: permitir que qualquer agente evolua temas, componentes e telas usando o Ceres Design Tokens sem quebrar o contrato do sistema.

## Escopo

Use este guia quando a tarefa envolver:

- criar ou refinar temas
- estilizar componentes com Tailwind v4
- adaptar componentes `shadcn/ui`
- criar variantes solidas, translúcidas ou glass
- aplicar motion, blur, sombra, opacidade, radius, spacing e tipografia com consistencia

Nao use este guia para depender de arquivos internos como `tokens/primitives/**` ou `tokens/brand/**` no app consumidor. Esses arquivos continuam internos ao pacote. O consumidor deve usar apenas a API publica do pacote.

## Regra Principal

O caminho correto do sistema e:

1. tokens semanticos publicos em `tokens/semantics/**`
2. overrides publicos de modo em `tokens/themes/dark/**`
3. build do pacote gerando `theme.css`, `tokens.json` e wrappers JS
4. import do `theme.css` no app com Tailwind v4
5. uso das custom properties e utilities geradas nas classes Tailwind
6. composicao dessas classes dentro dos componentes `shadcn/ui`

Em outras palavras:

`Ceres public contract -> theme.css -> Tailwind v4 utilities / CSS variables -> shadcn variants / slots -> componentes finais`

## Imports Publicos

CSS de tema:

```css
@import "tailwindcss";
@import "@ceres_design_system/design-tokens/ceres/light.css";
```

Runtime JS:

```ts
import tokens from "@ceres_design_system/design-tokens/ceres/light";
```

Contrato:

```ts
// arquivo markdown publico
@ceres_design_system/design-tokens/contract
```

Guia para agente:

```ts
// arquivo markdown publico
@ceres_design_system/design-tokens/agent-guide
```

Recipes:

```ts
import buttonRecipe from "@ceres_design_system/design-tokens/recipes/button";
```

## Como o Sistema Deve Ser Pensado

O agente deve sempre decidir nesta ordem:

1. Qual e o papel semantico do componente?
2. O material e solido, translúcido ou glass?
3. A borda e sólida, translucida, gradiente ou inexistente?
4. O componente precisa de sombra, blur, overlay ou state layer?
5. O movimento e de press, hover, dialog, page ou emphasis?
6. O token ja existe no contrato publico?
7. A implementacao pode ser feita so com utilities?
8. Se nao, deve virar uma classe reutilizavel em `@layer components` ou no proprio componente?

## O Que Cada Grupo de Tokens Resolve

### Color

Use `color.background.*` para superficies solidas de canvas, surface, inverse e brand.

Use `color.action.*` para variantes de acao, especialmente em botoes e controles.

Use `color.content.*` para texto.

Use `color.foreground.*` para icones e elementos graficos.

Use `color.border.*` para bordas solidas.

Use `color.feedback.*` para componentes de status como badge, alert, toast e banner.

Use `color.overlay.*` para scrims e escurecimento ou clareamento de fundo.

Use `color.stateLayer.*` para hover, pressed, focus e selected quando a superficie base continua a mesma e voce quer uma camada de interacao por cima.

Use `color.material.glass.*` quando o objetivo for material translucido ou glass:

- `color.material.glass.surfaceSoft`: fundo translucido leve
- `color.material.glass.surface`: glass base
- `color.material.glass.surfaceStrong`: glass mais denso
- `color.material.glass.border`: borda translucida
- `color.material.glass.highlight`: highlight para borda em gradiente

### Effect

Use `effect.shadow.*` para profundidade.

Use `effect.blur.backdrop.*` para `backdrop-filter`.

Use `effect.blur.surface.*` como presets prontos de glass para componentes.

Use `effect.blur.level.*` quando precisar da escala composicional completa em qualquer lugar.

Use `effect.opacity.disabled`, `effect.opacity.subtle` e `effect.opacity.scrim` para papeis semanticos ja definidos.

Use `effect.opacity.level.*` quando precisar da escala completa de transparencia:

- `transparent`
- `hairline`
- `soft`
- `muted`
- `strong`
- `heavy`
- `intense`
- `solid`

### Motion

Use `motion.duration.*` para valores base.

Use `motion.easing.*` para curvas base.

Use `motion.transition.*` quando o sistema ja tiver um preset claro:

- `press`
- `hover`
- `dialog`
- `page`
- `emphasis`

Boas escolhas:

- `motion.transition.press.*` para tap, click, scale e micro feedback
- `motion.transition.hover.*` para hover recorrente
- `motion.transition.dialog.*` para sheets, dialogs e modals
- `motion.transition.page.*` para trocas maiores de contexto
- `motion.duration.atmospheric` para hero, spotlight ou cenas mais cinemáticas
- `motion.easing.linear` para progressos lineares e loops

### Size, Typography, Layout e Layer

Use `size.radius.*`, `size.spacing.*`, `size.borderWidth.*`, `size.componentHeight.*` e `size.icon.*` para manter os componentes consistentes.

Use `typography.*` para fonte, tamanho, peso, tracking e line-height.

Use `layout.*` para breakpoints, containers e grid.

Use `layer.zIndex.*` para sticky, dropdown, overlay, modal, toast e tooltip.

## Regras de Composicao

### Fundo Solido

Fundo solido e o caminho padrao quando o componente precisa de alta legibilidade, contraste direto e comportamento previsivel.

Exemplos corretos:

- `bg-surface`
- `bg-surface-subtle`
- `bg-action-primary`
- `bg-action-neutral`
- `bg-success`
- `bg-warning`

Prefira fundo solido quando:

- o componente e de alta densidade
- o contraste precisa ser maximo
- o fundo por tras nao precisa aparecer
- o visual do produto e mais utilitario do que atmosferico

### Fundo Translucido

Use fundo translucido quando o fundo precisa aparecer parcialmente, mas sem o acabamento full glass.

Use preferencialmente:

- `bg-material-glass-surface-soft`
- `bg-material-glass-surface`
- `bg-material-glass-surface-strong`

Evite usar a propriedade `opacity` diretamente no container para simular translucidez se o texto e o icone devem continuar nítidos. `opacity` afeta tudo, inclusive o conteudo.

Se a ideia for deixar apenas o fundo translucido:

- use um token de material glass no background
- ou use pseudo-elemento para overlay
- ou use `color-mix()` com uma custom property publica

### Glass

Glass exige a combinacao de quatro camadas:

1. fundo translucido
2. borda translucida ou gradiente
3. `backdrop-filter`
4. sombra coerente

Receita recomendada:

- fundo: `color.material.glass.surface` ou `surfaceStrong`
- borda: `color.material.glass.border`
- highlight de gradiente: `color.material.glass.highlight`
- blur: `effect.blur.surface.soft`, `effect.blur.surface.glass` ou `effect.blur.surface.strong`
- sombra: `effect.shadow.sm`, `md` ou `lg`

Exemplo base:

```css
.glass-surface {
  border: 1px solid var(--color-material-glass-border);
  background: var(--color-material-glass-surface);
  backdrop-filter: blur(var(--blur-surface-glass));
  box-shadow: var(--shadow-md);
}
```

### Borda Solida

Use quando o contorno deve comunicar estrutura e hierarquia de modo direto.

Exemplos:

- `border-line-subtle`
- `border-line-strong`
- `border-line-brand`
- `border-line-success`

### Borda Translucida

Use quando o componente e translúcido ou glass, e a borda precisa ser suave.

Exemplo:

```html
<div class="border border-material-glass-border bg-material-glass-surface" />
```

### Borda em Gradiente

Borda em gradiente nao deve ser resolvida tentando trocar apenas `border-color`. O caminho correto e usar background em camadas, normalmente com `padding-box` e `border-box`.

Exemplo recomendado:

```css
.gradient-glass-border {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--color-material-glass-surface), var(--color-material-glass-surface)) padding-box,
    linear-gradient(135deg, var(--color-material-glass-highlight), transparent 75%) border-box;
}
```

Use borda em gradiente quando:

- o componente for premium, spotlight ou hero
- o highlight da borda fizer parte do material
- o efeito precisar ir do branco para transparente

### Borda So com Transparencia

Se o objetivo e apenas um contorno sutil, sem highlight:

- use `border-material-glass-border`
- combine com `bg-material-glass-surface-soft` ou `bg-material-glass-surface`

### Blur

Use `effect.blur.backdrop.*` e `effect.blur.surface.*` com `backdrop-filter`.

Use `effect.blur.level.*` com `filter: blur(...)` quando o elemento em si precisa ficar desfocado.

Boas praticas:

- blur pequeno para chips, pills e botoes
- blur medio para cards glass e sidebars flutuantes
- blur grande para modais, hero overlays e painéis amplos
- blur extremo apenas para atmosferas e arte-direcao

### Opacidade

Aplique `effect.opacity.level.*` em propriedades especificas, nao automaticamente no container inteiro.

Boas aplicacoes:

- overlay pseudo-elemento
- mascara de estado
- brilho sutil
- desabilitado quando o componente inteiro realmente deve perder presenca

Evite:

- reduzir a opacidade do container quando a leitura do label precisa continuar forte
- usar opacidade para substituir tokens de material quando ja existe `color.material.*`

### Shadow

Use `effect.shadow.sm` para botoes, pequenos cards e surfaces discretas.

Use `effect.shadow.md` para cards elevados, dropdowns e glass surfaces padrao.

Use `effect.shadow.lg` para modais, drawers e paineis de grande protagonismo.

### State Layer

Use `color.stateLayer.*` quando a superficie continua a mesma e a interacao acontece como camada.

Exemplos bons:

- card interativo que mantem `bg-surface`
- item de lista selecionado
- hover de input
- foco visivel sem trocar o background base

### Motion

Sempre pense no motivo da animacao:

- press: feedback tatil imediato
- hover: resposta recorrente
- dialog: entrada e saida de superficies temporarias
- page: mudança de contexto
- emphasis: momentos com mais protagonismo

Exemplos com Tailwind v4:

```html
<button class="transition duration-[var(--motion-transition-hover-duration)] ease-[var(--motion-transition-hover-easing)]" />

<button class="[transition-duration:var(--motion-transition-press-duration)] [transition-timing-function:var(--motion-transition-press-easing)]" />
```

## Tailwind v4: Caminho Correto

### 1. Importar o tema no CSS global

```css
@import "tailwindcss";
@import "@ceres_design_system/design-tokens/ceres/light.css";
```

### 2. Usar utilities quando o token ja tiver mapeamento direto

Exemplos:

- `bg-surface`
- `bg-action-primary`
- `bg-material-glass-surface`
- `text-content-primary`
- `border-line-subtle`
- `border-material-glass-border`
- `shadow-md`
- `rounded-surface-md`

### 3. Usar custom properties publicas em classes arbitrarias quando nao houver utility pronta

Exemplos:

- `backdrop-blur-[var(--blur-surface-glass)]`
- `backdrop-blur-[var(--blur-level-sm)]`
- `duration-[var(--motion-transition-hover-duration)]`
- `ease-[var(--motion-transition-hover-easing)]`
- `h-[var(--size-component-height-default)]`
- `[opacity:var(--effect-opacity-level-strong)]`

### 4. Criar classes reutilizaveis em `@layer components` quando a composicao exigir multiplas camadas

Faça isso para:

- glass
- borda em gradiente
- overlays customizados
- state layers com pseudo-elementos
- combinacoes recorrentes que ficariam ilegiveis inline

## shadcn/ui: Caminho Correto

O `shadcn/ui` deve ser a camada de componente. O design token nao entra diretamente no JSX por valor hardcoded; ele entra por classes e variaveis que o Tailwind ja entende.

Fluxo recomendado:

1. importar o tema globalmente
2. manter a base dos componentes em `cva` ou `cn`
3. criar variantes que apontam para tokens semanticos
4. usar classes reutilizaveis para glass e gradientes quando a combinacao for complexa
5. manter tamanho, radius, spacing, border, color, blur, shadow e motion alinhados ao contrato

### Exemplo em `Button`

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-interactive-md text-body-md transition",
  {
    variants: {
      variant: {
        primary:
          "h-[var(--size-component-height-default)] bg-action-primary text-on-action-primary shadow-sm duration-[var(--motion-transition-hover-duration)] ease-[var(--motion-transition-hover-easing)] hover:bg-action-primary-hover",
        neutral:
          "h-[var(--size-component-height-default)] border border-line-subtle bg-action-neutral text-on-action-neutral shadow-sm duration-[var(--motion-transition-hover-duration)] ease-[var(--motion-transition-hover-easing)] hover:bg-action-neutral-hover",
        glass:
          "glass-button h-[var(--size-component-height-default)] text-content-primary"
      }
    }
  }
);
```

### Exemplo em `DialogContent`

```tsx
<DialogContent className="border border-material-glass-border bg-material-glass-surface shadow-lg backdrop-blur-[var(--blur-backdrop-md)]">
  ...
</DialogContent>
```

### Exemplo em `Card`

```tsx
<Card className="border border-line-subtle bg-surface shadow-sm" />

<Card className="border border-material-glass-border bg-material-glass-surface shadow-md backdrop-blur-[var(--blur-surface-glass)]" />
```

## Como Escolher a Implementacao Certa

### Botao solido

Escolha quando:

- e CTA principal
- precisa de alto contraste
- nao depende do fundo por tras

Use:

- `color.action.*`
- `effect.shadow.sm`
- `motion.transition.hover.*`
- `motion.transition.press.*` quando houver feedback de escala

### Botao glass

Escolha quando:

- o componente deve parecer flutuante
- o fundo por tras deve participar visualmente
- a interface esta trabalhando uma linguagem premium ou atmosferica

Use:

- `color.material.glass.surface` ou `surfaceStrong`
- `color.material.glass.border`
- `color.material.glass.highlight`
- `effect.blur.surface.soft` ou `glass`
- `effect.shadow.sm` ou `md`
- `motion.transition.hover.*`
- `motion.transition.press.*`

### Card solido

Use `background.surface.*`, `border.*`, `shadow.*`, `content.*`.

### Card glass

Use `color.material.glass.*` + `effect.blur.surface.*` + `effect.shadow.*`.

### Modal ou drawer

Use:

- scrim: `color.overlay.scrim.color` + `color.overlay.scrim.opacity`
- panel: `color.background.surface.default` ou `color.material.glass.surfaceStrong`
- blur: `effect.blur.backdrop.md` ou `lg`
- shadow: `effect.shadow.lg`
- motion: `motion.transition.dialog.*`
- layer: `layer.zIndex.overlay` e `layer.zIndex.modal`

### Input

Prefira solido ou translucido leve. Glass completo em input so e recomendado quando a interface toda segue esse material.

Use focus com:

- `color.stateLayer.focus.*`
- `color.border.brand.default`

## Boas Praticas

- Use sempre o contrato publico antes de inventar valores.
- Prefira tokens semanticos a valores arbitrarios.
- Prefira `color.material.*` a `opacity` no container para glass.
- Prefira `stateLayer.*` a trocar o fundo inteiro quando a base do componente nao muda.
- Use `@layer components` para composicoes repetidas.
- Mantenha `radius`, `spacing`, `shadow` e `motion` consistentes entre variantes do mesmo componente.
- Quando criar variante nova em `shadcn/ui`, modele a variante no `cva`, nao em estilos inline espalhados.
- Quando precisar de gradiente de borda, use background em camadas.
- Quando precisar de desfoque do que esta por baixo do componente, use `backdrop-filter`, nao `filter`.
- Para dark mode, continue usando os mesmos paths publicos; o override de modo deve resolver o valor, nao o consumidor.

## O Que Evitar

- nao hardcodar hex, rgba, blur, shadow ou cubic-bezier no componente se existir token publico
- nao importar arquivos internos do pacote
- nao acoplar `shadcn/ui` a um valor cru de cor ou espacamento
- nao usar `opacity` no container inteiro para simular material glass quando o texto precisa permanecer forte
- nao usar borda gradiente trocando apenas `border-color`
- nao misturar sem criterio `action.*` com `material.*`

## Checklist Operacional Para o Agente

Quando o pedido for “melhorar o tema” ou “criar uma nova variante”, siga este checklist:

1. identificar o papel do componente
2. escolher o material: solido, translucido ou glass
3. escolher fundo, borda, sombra e blur
4. escolher state layer ou troca de surface
5. escolher motion: press, hover, dialog, page ou emphasis
6. aplicar via utilities Tailwind quando possivel
7. extrair para `@layer components` ou variante `cva` quando a composicao ficar complexa
8. manter tipografia, spacing, radius e height alinhados ao sistema
9. validar light e dark sem trocar os paths publicos
10. evitar qualquer dependencia fora do contrato publico

## Resultado Esperado

Se este guia for seguido, o agente deve conseguir:

- evoluir o tema com seguranca
- criar componentes solidos, translúcidos e glass
- usar bordas solidas, translucidas ou em gradiente
- aplicar blur, transparencia, sombra e motion em qualquer parte da interface
- integrar tudo corretamente entre Ceres, Tailwind v4 e `shadcn/ui`
- manter a evolucao como extensao natural do sistema, e nao como excecao
