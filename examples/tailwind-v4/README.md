# Tailwind v4 Example

Exemplo minimo de consumo do Ceres Design Tokens com Tailwind v4.

## Arquivos

- `app.css`: importa `tailwindcss` e um `theme.css` gerado pelo repositório
- `index.html`: mostra button, input, card, modal, badge e toast usando classes baseadas nos tokens exportados

## Como trocar brand e modo

Edite a linha de import em `app.css`:

```css
@import "../../dist/ceres/light/theme.css";
```

Exemplos:

- `../../dist/ceres/dark/theme.css`
- `../../dist/eris/light/theme.css`
- `../../dist/pluto/dark/theme.css`

## Exemplo de consumo

- `bg-brand`
- `text-content-primary`
- `border-line-subtle`
- `text-on-success`
- `shadow-md`
- `bg-material-glass-surface`
- `border-material-glass-border`
- `backdrop-blur-[var(--blur-surface-glass)]`
