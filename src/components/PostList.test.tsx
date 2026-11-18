import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import PostList from './PostList'
import { getPostsByUser } from '../api/posts'

vi.mock('../api/posts')

const posts = [
  { id: 1, userId: 1, title: 'First post', body: 'First body' },
  { id: 2, userId: 1, title: 'Second post', body: 'Second body' },
]

function renderPostList(userId: number | null) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <PostList userId={userId} />
    </QueryClientProvider>,
  )
}

describe('PostList', () => {
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
})
