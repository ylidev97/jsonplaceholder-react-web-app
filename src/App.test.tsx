import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { getUsers } from './api/users'
import { createPost, getPostsByUser } from './api/posts'

vi.mock('./api/users')
vi.mock('./api/posts')

const users = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
]

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  )
}

async function selectLeanne() {
  const authors = within(await screen.findByRole('complementary', { name: 'Autores' }))
  await userEvent.click(await authors.findByRole('button', { name: /Leanne Graham/ }))
}

describe('App', () => {
  beforeEach(() => {
    vi.mocked(getUsers).mockReset().mockResolvedValue(users)
    vi.mocked(getPostsByUser)
      .mockReset()
      .mockResolvedValue([{ id: 1, userId: 1, title: 'first post', body: 'first body' }])
    vi.mocked(createPost).mockReset()
  })

  it('R7: without a selected author, asks to choose one', async () => {
    renderApp()

    expect(await screen.findByText('Elige un autor')).toBeInTheDocument()
    expect(screen.getByText(/Selecciona a alguien de la lista/)).toBeInTheDocument()
  })

  it('R2: choosing an author shows their header and posts', async () => {
    renderApp()

    await selectLeanne()

    expect(await screen.findByRole('heading', { level: 2, name: 'Leanne Graham' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { level: 3, name: 'First post' })).toBeInTheDocument()
    expect(screen.queryByText('Elige un autor')).not.toBeInTheDocument()
  })

  it('on phones, the back button returns to the author list', async () => {
    renderApp()
    await selectLeanne()

    await userEvent.click(await screen.findByRole('button', { name: 'Volver a autores' }))

    expect(screen.getByText('Elige un autor')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Volver a autores' })).not.toBeInTheDocument()
  })

  it('R3: "Nueva publicación" opens the form and Escape closes it', async () => {
    renderApp()
    await selectLeanne()

    await userEvent.click(await screen.findByRole('button', { name: 'Nueva publicación' }))

    expect(screen.getByRole('dialog', { name: 'Nueva publicación' })).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('R3: publishing closes the form, shows a toast and adds the post first', async () => {
    vi.mocked(createPost).mockResolvedValue({ id: 101, userId: 1, title: 'brand new', body: 'some text' })
    renderApp()
    await selectLeanne()
    await userEvent.click(await screen.findByRole('button', { name: 'Nueva publicación' }))

    await userEvent.type(screen.getByLabelText('Título'), 'brand new')
    await userEvent.type(screen.getByLabelText('Texto'), 'some text')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(await screen.findByText('Publicación creada')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    const titles = await screen.findAllByRole('heading', { level: 3 })
    expect(titles.map((t) => t.textContent)).toEqual(['Brand new', 'First post'])
  })

  it('R7: "Escribir la primera publicación" opens the form', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([])
    renderApp()
    await selectLeanne()

    await userEvent.click(await screen.findByRole('button', { name: 'Escribir la primera publicación' }))

    expect(screen.getByRole('dialog', { name: 'Nueva publicación' })).toBeInTheDocument()
  })
})
