import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PostForm from './PostForm'
import PostList from './PostList'
import { createPost, getPostsByUser } from '../api/posts'

vi.mock('../api/posts')

const existing = { id: 1, userId: 1, title: 'Existing post', body: 'Existing body' }

function renderForm(client = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
  const onClose = vi.fn()
  const onPublished = vi.fn()
  render(
    <QueryClientProvider client={client}>
      <PostForm userId={1} authorName="Leanne Graham" onClose={onClose} onPublished={onPublished} />
      <PostList userId={1} authorName="Leanne Graham" onWrite={() => {}} />
    </QueryClientProvider>,
  )
  return { client, onClose, onPublished }
}

async function fillAndSubmit(title = 'New title', body = 'New body') {
  await userEvent.type(screen.getByLabelText('Título'), title)
  await userEvent.type(screen.getByLabelText('Texto'), body)
  await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))
}

describe('PostForm', () => {
  beforeEach(() => {
    vi.mocked(createPost).mockReset()
    vi.mocked(getPostsByUser).mockReset()
    vi.mocked(getPostsByUser).mockResolvedValue([existing])
  })

  it('shows the author it publishes as and focuses the title', () => {
    renderForm()

    expect(screen.getByRole('dialog', { name: 'Nueva publicación' })).toBeInTheDocument()
    expect(screen.getByText('Publicando como Leanne Graham')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveFocus()
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

  it('R3: with only the title filled, shows the text error, focuses the text and does not call the API', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), 'Only a title')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByText('El texto es obligatorio')).toBeInTheDocument()
    expect(screen.getByLabelText('Texto')).toHaveFocus()
    expect(createPost).not.toHaveBeenCalled()
  })

  it('R3: with only the text filled, shows the title error, focuses the title and does not call the API', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Texto'), 'Only a body')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getAllByRole('alert')).toHaveLength(1)
    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveFocus()
    expect(createPost).not.toHaveBeenCalled()
  })

  it('R3: a title over 100 characters is not valid', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), 'a'.repeat(101))
    await userEvent.type(screen.getByLabelText('Texto'), 'Some body')
    await userEvent.click(screen.getByRole('button', { name: 'Publicar' }))

    expect(screen.getByText('Usa menos de 100 caracteres')).toBeInTheDocument()
    expect(createPost).not.toHaveBeenCalled()
  })

  it('R3: errors update live while typing', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), 'a')
    await userEvent.clear(screen.getByLabelText('Título'))

    expect(screen.getByText('El título es obligatorio')).toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Título'), 'Hello')

    expect(screen.queryByText('El título es obligatorio')).not.toBeInTheDocument()
  })

  it('shows the title and word counters', async () => {
    renderForm()

    await userEvent.type(screen.getByLabelText('Título'), 'Hello')
    await userEvent.type(screen.getByLabelText('Texto'), 'two words')

    expect(screen.getByText('5/100')).toBeInTheDocument()
    expect(screen.getByText('2 palabras')).toBeInTheDocument()
  })

  it('R3: a valid submit adds the new post first and reports it as published', async () => {
    vi.mocked(createPost).mockResolvedValue({ id: 101, userId: 1, title: 'New title', body: 'New body' })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    client.setQueryData(['posts', 1], [existing])
    const { onPublished } = renderForm(client)

    await fillAndSubmit()

    expect(vi.mocked(createPost).mock.calls[0][0]).toEqual({
      userId: 1,
      title: 'New title',
      body: 'New body',
    })
    const titles = await screen.findAllByRole('heading', { level: 3 })
    expect(titles.map((t) => t.textContent)).toEqual(['New title', 'Existing post'])
    expect(screen.getByText('Recién publicada')).toBeInTheDocument()
    expect(onPublished).toHaveBeenCalledTimes(1)
  })

  it('R3: the submit button is disabled while sending', async () => {
    vi.mocked(createPost).mockReturnValue(new Promise(() => {}))
    renderForm()

    await fillAndSubmit('A title', 'A body')

    expect(screen.getByRole('button', { name: 'Publicando…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
  })

  it('R3: while sending, a second submit is ignored and the modal cannot be closed', async () => {
    vi.mocked(createPost).mockReturnValue(new Promise(() => {}))
    const { onClose } = renderForm()
    await fillAndSubmit('A title', 'A body')
    const dialog = screen.getByRole('dialog')

    // Let any (wrongly) started request reach the API before checking.
    await act(async () => {
      fireEvent.submit(dialog)
      fireEvent.keyDown(dialog, { key: 'Escape' })
      fireEvent.click(dialog.parentElement!)
    })

    expect(createPost).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('R3: clicking the backdrop closes the modal, but clicking inside does not', async () => {
    const { onClose } = renderForm()
    const dialog = screen.getByRole('dialog')

    await userEvent.click(screen.getByLabelText('Título'))

    expect(onClose).not.toHaveBeenCalled()

    await userEvent.click(dialog.parentElement!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('R3: creating several posts gives each one a unique id', async () => {
    vi.mocked(createPost).mockImplementation(async (post) => ({ id: 101, ...post }))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    client.setQueryData(['posts', 1], [existing])
    renderForm(client)

    for (const title of ['First new', 'Second new']) {
      await userEvent.clear(screen.getByLabelText('Título'))
      await userEvent.clear(screen.getByLabelText('Texto'))
      await fillAndSubmit(title, 'Some body')
      await screen.findByRole('heading', { name: title })
    }

    const ids = client.getQueryData<{ id: number }[]>(['posts', 1])!.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(errorSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('R4: if sending fails, shows an error and "Reintentar" sends the same post again', async () => {
    vi.mocked(createPost)
      .mockRejectedValueOnce(new Error('Network Error'))
      .mockResolvedValueOnce({ id: 101, userId: 1, title: 'New title', body: 'New body' })
    const { onPublished } = renderForm()

    await fillAndSubmit()

    expect(await screen.findByText('No se pudo publicar')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('New title')
    expect(onPublished).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByRole('heading', { name: 'New title' })).toBeInTheDocument()
    expect(createPost).toHaveBeenCalledTimes(2)
    expect(onPublished).toHaveBeenCalledTimes(1)
  })

  it('closes with Escape, the close button and Cancelar', async () => {
    const { onClose } = renderForm()

    await userEvent.keyboard('{Escape}')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(onClose).toHaveBeenCalledTimes(3)
  })
})
