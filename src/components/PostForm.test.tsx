import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PostForm from './PostForm'
import PostList from './PostList'
import { createPost, getPostsByUser } from '../api/posts'

vi.mock('../api/posts')

const existing = { id: 1, userId: 1, title: 'Existing post', body: 'Existing body' }

function renderForm(client = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
  return render(
    <QueryClientProvider client={client}>
      <PostForm userId={1} />
      <PostList userId={1} />
    </QueryClientProvider>,
  )
}

describe('PostForm', () => {
  beforeEach(() => {
    vi.mocked(createPost).mockReset()
  })

  it('AC2: submitting the empty form shows 2 errors and does not call the API', async () => {
    renderForm()

    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('El texto es obligatorio')).toBeInTheDocument()
    expect(createPost).not.toHaveBeenCalled()
  })

  it('R3: whitespace-only fields are not valid', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), '   ')
    await userEvent.type(screen.getByLabelText('Texto'), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(createPost).not.toHaveBeenCalled()
  })

  it('R3: a valid submit adds the new post first and clears the form', async () => {
    vi.mocked(createPost).mockResolvedValue({ id: 101, userId: 1, title: 'New title', body: 'New body' })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    client.setQueryData(['posts', 1], [existing])
    renderForm(client)

    await userEvent.type(screen.getByLabelText('Título'), 'New title')
    await userEvent.type(screen.getByLabelText('Texto'), 'New body')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(vi.mocked(createPost).mock.calls[0][0]).toEqual({
      userId: 1,
      title: 'New title',
      body: 'New body',
    })

    const titles = await screen.findAllByRole('heading', { level: 3 })
    expect(titles.map((t) => t.textContent)).toEqual(['New title', 'Existing post'])
    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getByLabelText('Texto')).toHaveValue('')
  })

  it('R3: the submit button is disabled while sending', async () => {
    vi.mocked(createPost).mockReturnValue(new Promise(() => {}))
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), 'A title')
    await userEvent.type(screen.getByLabelText('Texto'), 'A body')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByRole('button', { name: 'Publicar' })).toBeDisabled()
  })

  it('R3: creating several posts gives each one a unique id', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([existing])
    vi.mocked(createPost).mockImplementation(async (post) => ({ id: 101, ...post }))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    client.setQueryData(['posts', 1], [existing])
    renderForm(client)

    for (const title of ['First new', 'Second new']) {
      await userEvent.type(screen.getByLabelText('Título'), title)
      await userEvent.type(screen.getByLabelText('Texto'), 'Some body')
      await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))
      await screen.findByRole('heading', { name: title })
    }

    const ids = client.getQueryData<{ id: number }[]>(['posts', 1])!.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })
})
