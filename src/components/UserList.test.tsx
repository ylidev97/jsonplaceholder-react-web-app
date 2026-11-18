import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
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

    expect(await screen.findByRole('button', { name: 'Ervin Howell', pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leanne Graham', pressed: false })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Leanne Graham' }))

    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
