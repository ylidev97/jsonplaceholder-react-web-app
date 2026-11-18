import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import StatusMessage from './StatusMessage'

interface UserListProps {
  selectedUserId: number | null
  onSelect: (userId: number) => void
}

export default function UserList({ selectedUserId, onSelect }: UserListProps) {
  const { data: users = [], isPending, isError, refetch } = useUsers()
  const [search, setSearch] = useState('')

  if (isPending) return <StatusMessage type="loading" message="Cargando autores…" />

  if (isError) {
    return (
      <StatusMessage
        type="error"
        message="No se pudieron cargar los autores"
        onRetry={() => refetch()}
      />
    )
  }

  if (users.length === 0) {
    return (
      <p role="status" className="p-4 text-gray-600">
        No hay autores disponibles
      </p>
    )
  }

  const term = search.trim().toLowerCase()
  const filtered = users.filter((user) => user.name.toLowerCase().includes(term))
  const noMatches = term !== '' && filtered.length === 0

  return (
    <section className="p-4">
      <label htmlFor="author-search" className="mb-1 block text-sm font-medium">
        Buscar autor
      </label>
      <input
        id="author-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded border border-gray-300 px-3 py-2 focus:outline-2 focus:outline-blue-600"
      />

      {noMatches ? (
        <div role="status" className="text-center">
          <p className="font-semibold">Ningún autor coincide con “{search.trim()}”</p>
          <p className="mb-3 text-sm text-gray-600">
            Prueba con un nombre más corto o revisa la ortografía.
          </p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 focus:outline-2 focus:outline-blue-600"
          >
            Borrar búsqueda
          </button>
        </div>
      ) : (
        <ul className="space-y-1">
          {filtered.map((user) => {
            const selected = user.id === selectedUserId
            return (
              <li key={user.id}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelect(user.id)}
                  className={`w-full rounded px-3 py-2 text-left focus:outline-2 focus:outline-blue-600 ${
                    selected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {user.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
