import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PostList from './PostList'
import { getPostsByUser } from '../api/posts'

vi.mock('../api/posts')

const posts = [
  { id: 1, userId: 1, title: 'First post', body: 'First body' },
  { id: 2, userId: 1, title: 'Second post', body: 'Second body' },
]

function renderPostList(userId: number | null, onWrite = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <PostList userId={userId} authorName="Leanne Graham" onWrite={onWrite} />
    </QueryClientProvider>,
  )
}

describe('PostList', () => {
  beforeEach(() => {
    vi.mocked(getPostsByUser).mockReset()
  })

  it('R2: shows the posts of the selected author', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue(posts)
    renderPostList(1)

    expect(await screen.findByText('First post')).toBeInTheDocument()
    expect(screen.getByText('Second post')).toBeInTheDocument()
    expect(getPostsByUser).toHaveBeenCalledWith(1)
  })

  it('R2: does not request posts when no author is selected', () => {
    vi.mocked(getPostsByUser).mockClear()
    renderPostList(null)

    expect(getPostsByUser).not.toHaveBeenCalled()
  })

  it('R3: title and text start with a capital letter', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([
      { id: 1, userId: 1, title: 'lowercase title', body: 'lowercase body' },
    ])
    renderPostList(1)

    expect(await screen.findByText('Lowercase title')).toBeInTheDocument()
    expect(screen.getByText('Lowercase body')).toBeInTheDocument()
  })

  it('R4: shows a loading message while waiting', () => {
    vi.mocked(getPostsByUser).mockReturnValue(new Promise(() => {}))
    renderPostList(1)

    expect(screen.getByText('Cargando publicaciones…')).toBeInTheDocument()
  })

  it('R4: shows an error with "Reintentar", which requests the posts again', async () => {
    vi.mocked(getPostsByUser).mockRejectedValueOnce(new Error('Network Error')).mockResolvedValueOnce(posts)
    renderPostList(1)

    expect(await screen.findByText('No se pudieron cargar las publicaciones')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('First post')).toBeInTheDocument()
    expect(getPostsByUser).toHaveBeenCalledTimes(2)
  })

  it('R7: shows an empty state when the author has no posts', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([])
    const onWrite = vi.fn()
    renderPostList(1, onWrite)

    expect(await screen.findByText('Aún no hay publicaciones')).toBeInTheDocument()
    expect(screen.getByText('Leanne Graham no ha publicado nada.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Escribir la primera publicación' }))

    expect(onWrite).toHaveBeenCalledTimes(1)
  })
})
