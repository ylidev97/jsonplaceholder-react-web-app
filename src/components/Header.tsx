import { useTheme } from '../hooks/useTheme'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b border-line p-4">
      <h1 className="text-3xl font-semibold">MyEditorial</h1>
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded border border-line px-3 py-1 hover:bg-hover focus:outline-2 focus:outline-accent"
      >
        {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      </button>
    </header>
  )
}
