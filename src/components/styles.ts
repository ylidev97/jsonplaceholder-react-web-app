// Shared Tailwind class strings for the "Classical" design:
// outlined buttons (never filled) and transparent inputs with hairline borders.
const button =
  'inline-flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded border px-4 py-2 font-heading text-base font-semibold disabled:cursor-not-allowed disabled:opacity-45'

export const btnPrimary = `${button} border-accent text-accent-strong hover:bg-accent/12 active:bg-accent/20`
export const btnSecondary = `${button} border-line hover:bg-fg/6 active:bg-fg/12`
export const btnGhost = `${button} border-transparent text-accent-strong hover:bg-accent/10 active:bg-accent/18`

export const inputClass =
  'w-full min-h-11 rounded border border-line bg-transparent px-3 py-1.5 text-base text-fg caret-accent hover:border-fg/45 focus-visible:border-accent focus-visible:outline-offset-0 disabled:opacity-60'
