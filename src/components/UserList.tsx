import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import { initials } from '../utils/initials'
import { ChevronRightIcon, SearchIcon, XIcon } from './Icons'
import StatusMessage from './StatusMessage'
import { btnGhost, inputClass } from './styles'

interface UserListProps {
  selectedUserId: number | null
  onSelect: (userId: number) => void
}

export default function UserList({ selectedUserId, onSelect }: UserListProps) {
  const { data: users = [], isPending, isError, refetch } = useUsers()
  const [search, setSearch] = useState('')

  const ready = !isPending && !isError
  const term = search.trim().toLowerCase()
  const filtered = users.filter((user) => user.name.toLowerCase().includes(term))

  let countLabel = ''
  if (ready) {
    countLabel = term
      ? `${filtered.length} de ${users.length}`
      : `${users.length} ${users.length === 1 ? 'autor' : 'autores'}`
  }

  let content
  if (isPending) {
    content = <StatusMessage type="loading" skeleton="authors" message="Cargando autores…" />
  } else if (isError) {
    content = (
      <StatusMessage
        type="error"
        message="No se pudieron cargar los autores"
        description="Revisa tu conexión e inténtalo de nuevo."
        onRetry={() => refetch()}
      />
    )
  } else if (users.length === 0) {
    content = (
      <p role="status" className="p-4 text-muted">
        No hay autores disponibles
      </p>
    )
  } else if (term !== '' && filtered.length === 0) {
    content = (
      <div role="status" className="flex flex-col items-center gap-1.5 px-4 py-9 text-center">
        <p className="font-heading text-[22px] italic">Ningún autor coincide con “{search.trim()}”</p>
        <p className="text-sm text-muted">Prueba con un nombre más corto o revisa la ortografía.</p>
        <button type="button" onClick={() => setSearch('')} className={`${btnGhost} mt-1.5`}>
          Borrar búsqueda
        </button>
      </div>
    )
  } else {
    content = (
      <ul className="flex flex-col">
        {filtered.map((user) => {
          const selected = user.id === selectedUserId
          return (
            <li key={user.id}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(user.id)}
                className={`flex min-h-16 w-full cursor-pointer items-center gap-3.5 rounded px-3 py-2.5 text-left ${
                  selected ? 'bg-accent/12' : 'hover:bg-fg/6'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="grid size-10.5 flex-none place-items-center rounded-full border border-accent font-heading text-base font-semibold tracking-wide text-accent-strong"
                >
                  {initials(user.name)}
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={`truncate font-heading text-lg leading-tight font-semibold ${
                      selected ? 'text-accent-strong' : ''
                    }`}
                  >
                    {user.name}
                  </span>
                  <span className="truncate text-[13px] text-muted">{user.email}</span>
                </span>
                <ChevronRightIcon size={18} className="flex-none opacity-45 md:hidden" />
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-3 px-5 pt-5.5 pb-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-3xl">Autores</h2>
          <span aria-live="polite" className="text-xs text-muted tabular-nums">
            {countLabel}
          </span>
        </div>
        <div className="relative">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 opacity-55"
          />
          <label htmlFor="author-search" className="sr-only">
            Buscar autor
          </label>
          <input
            id="author-search"
            type="search"
            placeholder="Buscar por nombre"
            value={search}
            disabled={!ready}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pr-10 pl-9.5 [&::-webkit-search-cancel-button]:appearance-none`}
          />
          {search && (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => setSearch('')}
              className={`${btnGhost} absolute top-1/2 right-1 size-9 min-h-0 -translate-y-1/2 px-0 py-0 text-fg`}
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="mx-5 h-px bg-line" />
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pt-1.5 pb-6">{content}</div>
    </div>
  )
}
