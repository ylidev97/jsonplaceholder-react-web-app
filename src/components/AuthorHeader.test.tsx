import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthorHeader from './AuthorHeader'
import { getPostsByUser } from '../api/posts'

vi.mock('../api/posts')

const user = { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' }

function renderHeader(onNewPost = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <AuthorHeader user={user} onNewPost={onNewPost} />
    </QueryClientProvider>,
  )
  return onNewPost
}

describe('AuthorHeader', () => {
  beforeEach(() => {
    vi.mocked(getPostsByUser).mockReset()
  })

  it('shows the author name, email and number of posts', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([
      { id: 1, userId: 1, title: 'A', body: 'B' },
      { id: 2, userId: 1, title: 'C', body: 'D' },
    ])
    renderHeader()

    expect(screen.getByRole('heading', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'leanne@example.com' })).toHaveAttribute(
      'href',
      'mailto:leanne@example.com',
    )
    expect(await screen.findByText('2 publicaciones')).toBeInTheDocument()
  })

  it('uses the singular for one post', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([{ id: 1, userId: 1, title: 'A', body: 'B' }])
    renderHeader()

    expect(await screen.findByText('1 publicación')).toBeInTheDocument()
  })

  it('calls onNewPost from the "Nueva publicación" button', async () => {
    vi.mocked(getPostsByUser).mockResolvedValue([])
    const onNewPost = renderHeader()

    await userEvent.click(screen.getByRole('button', { name: 'Nueva publicación' }))

    expect(onNewPost).toHaveBeenCalledTimes(1)
  })
})
