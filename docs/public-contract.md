# Public Contract

Documento gerado a partir do source of truth do repositório.

## Escopo

- Contrato publico base: `tokens/semantics/**`
- Overrides de modo: `tokens/themes/dark/**`
- Camadas internas: `tokens/primitives/**` e `tokens/brand/**`

## Resumo

- Tokens semanticos publicos: 187
- Overrides dark: 61

## Uso Rapido

### Color

- `color.background.brand.default` -> `--color-brand` -> `bg-brand`
- `color.content.primary` -> `--color-content-primary` -> `text-content-primary`
- `color.border.subtle` -> `--color-line-subtle` -> `border-line-subtle`
- `color.feedback.success.foreground` -> `--color-on-success` -> `text-on-success`

### Typography

- `typography.body.body.sizeMedium` -> `--text-body-md` -> `text-body-md`
- `typography.title.page.sizeBase` -> `--text-title-page` -> `text-title-page`
- `typography.body.body.fontFamily` -> `--font-body` -> `font-body`

### Effects and Layout

- `effect.shadow.md` -> `--shadow-md` -> `shadow-md`
- `size.radius.surface.md` -> `--radius-surface-md` -> `rounded-surface-md`
- `layout.container.page` -> `--container-page` -> `max-w-page`
- `motion.duration.fast` -> `var(--motion-duration-fast)` em classes arbitrarias


## Contrato Base

### color

- `color.action.disabled.background` - Preenchimento para ações desabilitadas, comunicando indisponibilidade de forma neutra.
- `color.action.disabled.background-hover` - Estado hover idêntico ao base para evitar sinalizar interatividade em ações desabilitadas.
- `color.action.disabled.foreground` - Conteúdo sobre ação desabilitada, com contraste reduzido para reforçar o estado inativo.
- `color.action.inactive.background` - Preenchimento para ações inativas, quando o elemento continua presente mas sem prioridade visual.
- `color.action.inactive.background-hover` - Variação suave de hover para ações inativas que ainda permanecem interativas.
- `color.action.inactive.foreground` - Conteúdo sobre ação inativa, preservando leitura sem competir com ações ativas.
- `color.action.neutral.background` - Preenchimento neutro para ações secundárias, ghost-filled ou controles de baixa ênfase.
- `color.action.neutral.background-hover` - Estado hover da ação neutra para indicar interatividade sem competir com a ação primária.
- `color.action.neutral.foreground` - Conteúdo sobre ação neutra, mantendo leitura confortável em superfícies claras.
- `color.action.primary.background` - Preenchimento base da ação principal. Use em botões e controles de maior prioridade.
- `color.action.primary.background-hover` - Estado hover da ação principal para reforçar resposta visual sem perder identidade.
- `color.action.primary.foreground` - Conteúdo sobre ação principal, garantindo legibilidade em alto contraste.
- `color.background.brand.default` - Fundo de destaque da marca para áreas institucionais, CTAs e elementos de alta ênfase.
- `color.background.canvas.default` - Plano de fundo base da aplicação ou página, usado atrás de toda a interface.
- `color.background.inverse.default` - Superfície escura para modos invertidos, sobreposições fortes e contextos noturnos.
- `color.background.inverse.subtle` - Variação escura mais suave para separar camadas internas dentro de contextos invertidos.
- `color.background.surface.default` - Superfície principal para cards, painéis e containers apoiados sobre o canvas.
- `color.background.surface.subtle` - Variação de superfície para diferenciar camadas próximas sem criar contraste forte.
- `color.border.brand.default` - Borda de marca para estados ativos, foco e contornos com ênfase.
- `color.border.inverse` - Borda para contextos escuros, mantendo contraste suficiente sem endurecer demais a interface.
- `color.border.strong` - Borda mais presente para inputs, contêineres destacados e delimitação clara.
- `color.border.subtle` - Borda leve para separar áreas relacionadas sem competir com o conteúdo.
- `color.content.brand.default` - Texto de marca para links, destaques editoriais e mensagens de ênfase.
- `color.content.disabled` - Texto para elementos desabilitados, comunicando indisponibilidade com contraste reduzido.
- `color.content.inactive` - Texto para elementos inativos, mantendo legibilidade sem competir com o estado ativo.
- `color.content.inverse` - Texto sobre fundos escuros ou de marca quando o conteúdo precisa de contraste máximo.
- `color.content.inverse-disabled` - Texto desabilitado em contextos escuros ou sobre superfícies invertidas.
- `color.content.primary` - Texto principal para leitura, títulos utilitários e informação de maior prioridade.
- `color.content.secondary` - Texto secundário para apoio, metadados e informação menos prioritária.
- `color.feedback.danger.background` - Fundo para erro, risco e ações destrutivas que exigem alta percepção de criticidade.
- `color.feedback.danger.border` - Contorno para mensagens de erro e estados destrutivos com maior presença visual.
- `color.feedback.danger.foreground` - Conteúdo sobre feedback crítico, mantendo leitura imediata em contexto de alerta.
- `color.feedback.info.background` - Fundo para mensagens informativas, status neutros e orientações de sistema.
- `color.feedback.info.border` - Contorno para blocos informativos quando a mensagem precisa de separação mais evidente.
- `color.feedback.info.foreground` - Conteúdo sobre feedback informativo, garantindo leitura clara em fundo azul.
- `color.feedback.success.background` - Fundo para mensagens e indicadores de sucesso, confirmação e conclusão positiva.
- `color.feedback.success.border` - Contorno para blocos de sucesso quando é útil reforçar separação e hierarquia.
- `color.feedback.success.foreground` - Conteúdo sobre feedback de sucesso, priorizando contraste e leitura imediata.
- `color.feedback.warning.background` - Fundo para alertas, atenção e estados que exigem revisão sem indicar falha crítica.
- `color.feedback.warning.border` - Contorno para componentes de aviso quando a mensagem precisa de maior delimitação.
- `color.feedback.warning.foreground` - Conteúdo sobre feedback de aviso com contraste forte para leitura rápida.
- `color.foreground.brand.default` - Foreground de marca para ícones e sinais visuais associados ao brand core.
- `color.foreground.default` - Cor padrão para ícones, elementos gráficos e foreground em superfícies claras.
- `color.foreground.disabled` - Foreground para ícones e affordances desabilitados, indicando indisponibilidade sem chamar atenção.
- `color.foreground.inactive` - Foreground para ícones e sinais visuais em elementos inativos, com ênfase reduzida.
- `color.foreground.inverse` - Foreground para uso sobre superfícies escuras ou fundos de marca com alto contraste.
- `color.foreground.inverse-disabled` - Foreground para ícones e sinais desabilitados em contextos escuros.
- `color.foreground.inverse-subtle` - Foreground suave para estados secundários dentro de contextos escuros.
- `color.foreground.subtle` - Foreground de menor contraste para elementos decorativos ou de apoio.
- `color.overlay.scrim.color` - Cor base do scrim para modais, dialogos e bloqueio de fundo.
- `color.overlay.scrim.opacity` - Opacidade do scrim para escurecimento mais forte do fundo.
- `color.overlay.subtle.color` - Cor base de overlay suave para escurecimento leve do fundo.
- `color.overlay.subtle.opacity` - Opacidade do overlay suave para drawers, side panels e foco moderado.
- `color.stateLayer.focus.color` - Cor base para foco e realce de elementos ativos.
- `color.stateLayer.focus.opacity` - Opacidade para foco visivel com reforco da cor de marca.
- `color.stateLayer.hover.color` - Cor base para camada de hover sobre superficies claras.
- `color.stateLayer.hover.opacity` - Opacidade de hover para indicar interacao de forma suave.
- `color.stateLayer.pressed.color` - Cor base para camada de pressed sobre superficies claras.
- `color.stateLayer.pressed.opacity` - Opacidade para pressed e estados de toque mais perceptiveis.
- `color.stateLayer.selected.color` - Cor base para estado selecionado em itens e controles.
- `color.stateLayer.selected.opacity` - Opacidade para itens selecionados com enfase moderada.

### effect

- `effect.blur.backdrop.lg` - Desfoque amplo para modais, hero overlays e planos de fundo com maior separacao.
- `effect.blur.backdrop.md` - Desfoque padrão para glass surfaces, drawers e paineis translúcidos.
- `effect.blur.backdrop.sm` - Desfoque para pequenos overlays, toolbars translúcidas e superficies discretas.
- `effect.blur.surface.glass` - Desfoque recomendado para cards e superficies de vidro como uso mais comum.
- `effect.opacity.disabled` - Opacidade recomendada para elementos desabilitados ou com enfase reduzida.
- `effect.opacity.scrim` - Opacidade para overlays de bloqueio, foco modal e escurecimento do fundo.
- `effect.opacity.subtle` - Opacidade para superficies transparentes suaves e componentes de apoio.
- `effect.shadow.lg` - Sombra ampla para modais, paineis elevados e camadas com maior profundidade.
- `effect.shadow.md` - Sombra intermediaria para cards, dropdowns e superficies com elevacao moderada.
- `effect.shadow.sm` - Sombra leve para elementos pequenos como botoes, tooltips e superficies discretas.

### layer

- `layer.zIndex.base` - Camada base do fluxo normal da interface.
- `layer.zIndex.dropdown` - Camada para menus, dropdowns e popovers pequenos.
- `layer.zIndex.modal` - Camada para modais, drawers e superficies temporarias maiores.
- `layer.zIndex.overlay` - Camada para overlays de bloqueio e scrims.
- `layer.zIndex.raised` - Camada para superficies ligeiramente elevadas.
- `layer.zIndex.sticky` - Camada para cabecalhos fixos e navegacao persistente.
- `layer.zIndex.toast` - Camada para toasts e feedbacks flutuantes.
- `layer.zIndex.tooltip` - Camada para tooltips e pequenos apoios acima dos demais overlays.

### layout

- `layout.breakpoint.desktop` - Ponto de quebra para desktop e aplicacoes com mais espaco.
- `layout.breakpoint.mobile` - Ponto de quebra para telas compactas e conteudo mobile.
- `layout.breakpoint.tablet` - Ponto de quebra para tablet e layouts intermediarios.
- `layout.breakpoint.ultraWide` - Ponto de quebra para experiencias expandidas e grandes paineis.
- `layout.breakpoint.wide` - Ponto de quebra para desktops amplos e paginas principais.
- `layout.container.full` - Container fluido sem largura maxima fixa.
- `layout.container.page` - Container base para paginas principais e layouts de aplicacao.
- `layout.container.reading` - Container para conteudo de leitura, artigos e blocos textuais.
- `layout.container.wide` - Container amplo para dashboards, areas densas e layouts expandidos.
- `layout.grid.desktop.columns` - Numero de colunas recomendado para desktop.
- `layout.grid.desktop.gutter` - Espaco entre colunas em grids desktop.
- `layout.grid.desktop.margin` - Margem externa base do grid desktop.
- `layout.grid.mobile.columns` - Numero de colunas recomendado para layouts mobile.
- `layout.grid.mobile.gutter` - Espaco entre colunas em grids mobile.
- `layout.grid.mobile.margin` - Margem externa base do grid mobile.
- `layout.grid.tablet.columns` - Numero de colunas recomendado para tablet.
- `layout.grid.tablet.gutter` - Espaco entre colunas em grids de tablet.
- `layout.grid.tablet.margin` - Margem externa base do grid de tablet.

### motion

- `motion.duration.emphasis` - Duracao para movimentos com maior carga expressiva ou destaque visual.
- `motion.duration.fast` - Duracao para acoes rapidas e interacoes recorrentes em componentes.
- `motion.duration.instant` - Duracao nula para mudancas que devem acontecer sem animacao perceptivel.
- `motion.duration.micro` - Duracao para feedbacks imediatos como hover, focus e pequenas mudancas de estado.
- `motion.duration.moderate` - Duracao base para transicoes gerais da interface.
- `motion.duration.slow` - Duracao para paineis, overlays e transicoes com mais respiro.
- `motion.easing.default` - Curva padrao para a maior parte das transicoes de interface.
- `motion.easing.emphasis` - Curva para animacoes com maior impacto visual e comportamento mais expressivo.
- `motion.easing.enter` - Curva recomendada para entradas de elementos e superfícies.
- `motion.easing.exit` - Curva recomendada para saídas e fechamentos de elementos.
- `motion.transition.dialog.enterDuration` - Duracao de entrada para dialogos, drawers e modais.
- `motion.transition.dialog.enterEasing` - Curva de entrada para superficies que surgem com suavidade.
- `motion.transition.dialog.exitDuration` - Duracao de saida para dialogos e superficies temporarias.
- `motion.transition.dialog.exitEasing` - Curva de saida para fechamento rapido e claro.
- `motion.transition.hover.duration` - Duracao recomendada para hover e resposta imediata em componentes.
- `motion.transition.hover.easing` - Curva padrao para feedbacks rapidos de hover.
- `motion.transition.page.duration` - Duracao para transicoes de pagina ou mudancas maiores de contexto.
- `motion.transition.page.easing` - Curva expressiva para transicoes mais marcantes de tela.

### size

- `size.borderWidth.accent` - Espessura forte para acentos visuais, tabs ativas e marcadores laterais.
- `size.borderWidth.strong` - Espessura para bordas mais presentes, foco e estados destacados.
- `size.borderWidth.subtle` - Espessura para bordas leves, separadores e contornos discretos.
- `size.componentHeight.comfortable` - Altura para componentes com mais conforto visual e area de toque ampliada.
- `size.componentHeight.default` - Altura base para componentes interativos no uso geral.
- `size.componentHeight.dense` - Altura para controles compactos em tabelas, filtros e toolbars densas.
- `size.componentHeight.touch` - Altura para acoes principais e contextos com prioridade maior de toque.
- `size.icon.controlLg` - Icone para controles maiores e acoes com mais destaque.
- `size.icon.controlMd` - Icone base para a maioria dos componentes interativos.
- `size.icon.controlSm` - Icone para botoes pequenos, campos densos e affordances compactas.
- `size.icon.displayMd` - Icone de destaque para comunicacao visual de maior escala.
- `size.icon.displaySm` - Icone para cards, recursos e empty states compactos.
- `size.icon.inline` - Tamanho para icones acompanhando texto e metadados inline.
- `size.radius.interactive.md` - Raio padrão para a maioria dos elementos interativos e componentes de ação.
- `size.radius.interactive.sm` - Raio para controles compactos, campos pequenos e botões discretos.
- `size.radius.pill` - Raio total para chips, badges, toggles, avatares e componentes em formato cápsula.
- `size.radius.surface.md` - Raio para superfícies amplas, modais, painéis e cards com maior protagonismo.
- `size.radius.surface.sm` - Raio para superfícies menores, como cards compactos, inputs agrupados e containers utilitários.
- `size.spacing.inline.lg` - Gap horizontal amplo para grupos independentes ou áreas com maior respiro visual.
- `size.spacing.inline.md` - Gap horizontal base para a maioria dos layouts de componentes e formulários.
- `size.spacing.inline.sm` - Gap horizontal pequeno para campos, botões e pares de informação relacionados.
- `size.spacing.inline.xs` - Gap horizontal curto para ícone e texto, metadados ou grupos compactos.
- `size.spacing.inset.lg` - Padding interno amplo para modais, painéis e componentes com mais conteúdo.
- `size.spacing.inset.md` - Padding interno base para cards, botões, inputs e superfícies padrão.
- `size.spacing.inset.sm` - Padding interno compacto para componentes pequenos, badges e controles densos.
- `size.spacing.stack.lg` - Empilhamento vertical amplo para seções maiores, cards ou grupos de conteúdo independentes.
- `size.spacing.stack.md` - Empilhamento vertical confortável para separar blocos internos e subseções.
- `size.spacing.stack.sm` - Empilhamento vertical padrão para pares de label e conteúdo ou itens de lista compactos.
- `size.spacing.stack.xs` - Empilhamento vertical curto para elementos diretamente relacionados no mesmo bloco.

### typography

- `typography.body.body.fontFamily` - Família padrão para leitura em interface, conteúdos corridos e textos funcionais.
- `typography.body.body.fontStyleItalic` - Estilo itálico para ênfase editorial, termos especiais e pequenos destaques narrativos.
- `typography.body.body.fontWeightMedium` - Peso para ênfases moderadas em corpo de texto, labels e destaques discretos.
- `typography.body.body.fontWeightRegular` - Peso padrão para leitura contínua e conteúdo base.
- `typography.body.body.fontWeightSemibold` - Peso para trechos de destaque, chamadas curtas e corpo com maior autoridade visual.
- `typography.body.body.fontWeightStrong` - Variação de maior ênfase para destacar informação importante dentro do fluxo de leitura.
- `typography.body.body.sizeLarge` - Body ampliado para introduções, textos de destaque e leitura confortável em blocos curtos.
- `typography.body.body.sizeMedium` - Body padrão para leitura principal em aplicações e páginas.
- `typography.body.body.sizeSmall` - Body compacto para tabelas, listas densas e supporting text.
- `typography.body.code.fontFamily` - Família monoespaçada para trechos de código, tokens, comandos e dados técnicos.
- `typography.body.code.fontWeight` - Peso padrão para preservar ritmo e alinhamento em textos monoespaçados.
- `typography.body.code.sizeBase` - Tamanho padrão para blocos de código, terminal e dados monoespaçados.
- `typography.body.code.sizeLarge` - Código ampliado para demos, apresentações ou interfaces técnicas com leitura destacada.
- `typography.body.code.sizeSmall` - Código compacto para snippets inline e contextos com pouco espaço.
- `typography.heading.heading.fontFamily` - Família para headings utilitários e títulos de bloco dentro da interface.
- `typography.heading.heading.fontWeight` - Peso recomendado para headings, equilibrando destaque e legibilidade.
- `typography.heading.heading.sizeBase` - Heading padrão para cartões, painéis e seções internas.
- `typography.heading.heading.sizeLarge` - Heading ampliado para seções mais relevantes ou agrupamentos de maior destaque.
- `typography.heading.heading.sizeSmall` - Heading compacto para módulos menores e componentes com pouco espaço vertical.
- `typography.heading.subheading.fontFamily` - Família para subheadings que introduzem conteúdo de apoio logo abaixo de um heading.
- `typography.heading.subheading.fontWeight` - Peso padrão para subheading, preservando a diferença hierárquica em relação ao heading.
- `typography.heading.subheading.sizeLarge` - Subheading maior para introduções com mais peso visual, sem virar heading principal.
- `typography.heading.subheading.sizeMedium` - Subheading intermediário para blocos de conteúdo padrão.
- `typography.heading.subheading.sizeSmall` - Subheading mínimo para componentes compactos e estruturas densas.
- `typography.letterSpacing.body` - Tracking neutro para leitura corrida e conteudo principal.
- `typography.letterSpacing.code` - Tracking neutro para manter alinhamento em textos monoespacados.
- `typography.letterSpacing.display` - Tracking para displays e titulos hero muito grandes.
- `typography.letterSpacing.heading` - Tracking para headings e subheadings utilitarios.
- `typography.letterSpacing.label` - Tracking levemente aberto para labels e pequenas interfaces.
- `typography.letterSpacing.title` - Tracking para titulos de pagina e subtitulos com mais presenca.
- `typography.title.hero.fontFamily` - Família padrão para títulos hero, priorizando presença visual e legibilidade em tela.
- `typography.title.hero.fontWeight` - Peso forte para o nível máximo de hierarquia tipográfica da interface.
- `typography.title.hero.size` - Tamanho principal para hero titles, manchetes amplas e mensagens de alto impacto.
- `typography.title.page.fontFamily` - Família para títulos de página, consistente com a navegação e os headings principais.
- `typography.title.page.fontWeight` - Peso principal para reforçar identidade e hierarquia do título de página.
- `typography.title.page.sizeBase` - Tamanho padrão do título de página em contextos desktop ou layouts amplos.
- `typography.title.page.sizeLarge` - Variação expandida do título de página para páginas de destaque ou aberturas editoriais.
- `typography.title.page.sizeSmall` - Variação compacta do título de página para breakpoints menores ou layouts densos.
- `typography.title.subtitle.fontFamily` - Família para subtítulos que acompanham títulos e introduzem contexto adicional.
- `typography.title.subtitle.fontWeight` - Peso leve para manter contraste hierárquico em relação ao título principal.
- `typography.title.subtitle.sizeBase` - Subtítulo padrão para aberturas de seção e introduções curtas.
- `typography.title.subtitle.sizeLarge` - Subtítulo ampliado para composições editoriais e cabeçalhos mais expressivos.
- `typography.title.subtitle.sizeSmall` - Subtítulo compacto para espaços limitados ou combinações mais discretas.

## Overrides Dark

- `color.action.disabled.background`
- `color.action.disabled.background-hover`
- `color.action.disabled.foreground`
- `color.action.inactive.background`
- `color.action.inactive.background-hover`
- `color.action.inactive.foreground`
- `color.action.neutral.background`
- `color.action.neutral.background-hover`
- `color.action.neutral.foreground`
- `color.action.primary.background`
- `color.action.primary.background-hover`
- `color.action.primary.foreground`
- `color.background.brand.default`
- `color.background.canvas.default`
- `color.background.inverse.default`
- `color.background.inverse.subtle`
- `color.background.surface.default`
- `color.background.surface.subtle`
- `color.border.brand.default`
- `color.border.inverse`
- `color.border.strong`
- `color.border.subtle`
- `color.content.brand.default`
- `color.content.disabled`
- `color.content.inactive`
- `color.content.inverse`
- `color.content.inverse-disabled`
- `color.content.primary`
- `color.content.secondary`
- `color.feedback.danger.background`
- `color.feedback.danger.border`
- `color.feedback.danger.foreground`
- `color.feedback.info.background`
- `color.feedback.info.border`
- `color.feedback.info.foreground`
- `color.feedback.success.background`
- `color.feedback.success.border`
- `color.feedback.success.foreground`
- `color.feedback.warning.background`
- `color.feedback.warning.border`
- `color.feedback.warning.foreground`
- `color.foreground.brand.default`
- `color.foreground.default`
- `color.foreground.disabled`
- `color.foreground.inactive`
- `color.foreground.inverse`
- `color.foreground.inverse-disabled`
- `color.foreground.inverse-subtle`
- `color.foreground.subtle`
- `color.overlay.scrim.color`
- `color.overlay.scrim.opacity`
- `color.overlay.subtle.color`
- `color.overlay.subtle.opacity`
- `color.stateLayer.focus.color`
- `color.stateLayer.focus.opacity`
- `color.stateLayer.hover.color`
- `color.stateLayer.hover.opacity`
- `color.stateLayer.pressed.color`
- `color.stateLayer.pressed.opacity`
- `color.stateLayer.selected.color`
- `color.stateLayer.selected.opacity`

## Observacoes

- O modo light e o baseline semantico do sistema.
- O dark nao cria contrato novo; apenas sobrescreve paths publicos existentes.
- O build exporta esses mesmos paths para `theme.css` e `tokens.json` por brand/mode.

