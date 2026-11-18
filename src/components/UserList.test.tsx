import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UserList from './UserList'
import { getUsers } from '../api/users'

vi.mock('../api/users')

const users = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'a@a.com' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'b@b.com' },
]

function renderUserList(selectedUserId: number | null = null, onSelect = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <UserList selectedUserId={selectedUserId} onSelect={onSelect} />
    </QueryClientProvider>,
  )
}

describe('UserList', () => {
  beforeEach(() => {
    vi.mocked(getUsers).mockReset()
  })

  it('AC1: typing "leanne" shows only Leanne Graham', async () => {
    vi.mocked(getUsers).mockResolvedValue(users)
    renderUserList()

    expect(await screen.findByText('Ervin Howell')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Buscar autor'), 'leanne')

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.queryByText('Ervin Howell')).not.toBeInTheDocument()
  })

  it('shows the no-match message and "Borrar búsqueda" restores the list', async () => {
    vi.mocked(getUsers).mockResolvedValue(users)
    renderUserList()
    await screen.findByText('Leanne Graham')

    await userEvent.type(screen.getByLabelText('Buscar autor'), 'Zelda')

    expect(screen.getByText('Ningún autor coincide con “Zelda”')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Borrar búsqueda' }))

    expect(screen.getByText('Leanne Graham')).toBeInTheDocument()
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })

  it('R2: highlights the selected author and reports clicks', async () => {
    vi.mocked(getUsers).mockResolvedValue(users)
    const onSelect = vi.fn()
    renderUserList(2, onSelect)

    expect(await screen.findByRole('button', { name: /Ervin Howell/, pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Leanne Graham/, pressed: false })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Leanne Graham/ }))

    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('AC3: if GET /users fails, the error message is shown', async () => {
    vi.mocked(getUsers).mockRejectedValue(new Error('Network Error'))
    renderUserList()

    expect(await screen.findByText('No se pudieron cargar los autores')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument()
  })

  it('R4: "Reintentar" requests the authors again', async () => {
    vi.mocked(getUsers).mockRejectedValueOnce(new Error('Network Error')).mockResolvedValueOnce(users)
    renderUserList()

    await userEvent.click(await screen.findByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Leanne Graham')).toBeInTheDocument()
    expect(getUsers).toHaveBeenCalledTimes(2)
  })

  it('R4: shows a loading message while waiting', () => {
    vi.mocked(getUsers).mockReturnValue(new Promise(() => {}))
    renderUserList()

    expect(screen.getByText('Cargando autores…')).toBeInTheDocument()
  })

  it('R7: shows an empty state when there are no authors', async () => {
    vi.mocked(getUsers).mockResolvedValue([])
    renderUserList()

    expect(await screen.findByText('No hay autores disponibles')).toBeInTheDocument()
  })

  it('shows the email, initials and the authors count', async () => {
    vi.mocked(getUsers).mockResolvedValue(users)
    renderUserList()

    expect(await screen.findByText('a@a.com')).toBeInTheDocument()
    expect(screen.getByText('LG')).toBeInTheDocument()
    expect(screen.getByText('2 autores')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Buscar autor'), 'leanne')

    expect(screen.getByText('1 de 2')).toBeInTheDocument()
  })

  it('clears the search with the clear button inside the field', async () => {
    vi.mocked(getUsers).mockResolvedValue(users)
    renderUserList()
    await screen.findByText('Leanne Graham')

    await userEvent.type(screen.getByLabelText('Buscar autor'), 'zelda')
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))

    expect(screen.getByLabelText('Buscar autor')).toHaveValue('')
    expect(screen.getByText('Ervin Howell')).toBeInTheDocument()
  })
})
