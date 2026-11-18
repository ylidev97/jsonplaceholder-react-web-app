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
})
