import { useTheme } from '../hooks/useTheme'
import { ChevronLeftIcon, MoonIcon, SunIcon } from './Icons'
import { btnGhost } from './styles'

interface HeaderProps {
  // On phones, the posts screen shows a "back to authors" button instead of the brand.
  onBack?: () => void
}

export default function Header({ onBack }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <header className="flex min-h-15 flex-none items-center gap-2 border-b border-line py-2 pr-4 pl-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a autores"
          className={`${btnGhost} min-h-11 gap-0.5 py-0 pr-2 pl-0.5 md:hidden`}
        >
          <ChevronLeftIcon size={22} />
          Autores
        </button>
      )}
      <h1
        className={`text-2xl tracking-tight ${onBack ? 'hidden md:block' : ''}`}
      >
        My<em className="font-normal">Editorial</em>
      </h1>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
        className="ml-auto grid size-11 cursor-pointer place-items-center rounded-full border border-line hover:bg-fg/6 active:bg-fg/12"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}
