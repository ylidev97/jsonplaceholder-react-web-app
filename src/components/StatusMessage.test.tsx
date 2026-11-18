import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import StatusMessage from './StatusMessage'

describe('StatusMessage', () => {
  it('R4: shows the loading message', () => {
    render(<StatusMessage type="loading" message="Cargando…" />)

    expect(screen.getByRole('status')).toHaveTextContent('Cargando…')
  })

  it('R4: shows the error message and calls onRetry from the "Reintentar" button', async () => {
    const onRetry = vi.fn()
    render(<StatusMessage type="error" message="Algo falló" onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Algo falló')

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('R4: shows the optional description of an error', () => {
    render(<StatusMessage type="error" message="Falló" description="Inténtalo de nuevo" onRetry={vi.fn()} />)

    expect(screen.getByText('Inténtalo de nuevo')).toBeInTheDocument()
  })

  it('R4: the loading skeleton does not add text to the status message', () => {
    render(<StatusMessage type="loading" skeleton="authors" message="Cargando autores…" />)

    expect(screen.getByRole('status')).toHaveTextContent(/^Cargando autores…$/)
  })
})
