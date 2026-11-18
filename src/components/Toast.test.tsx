import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Toast from './Toast'

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the message and dismisses itself after a few seconds', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast message="Publicación creada" onDismiss={onDismiss} />)

    expect(screen.getByRole('status')).toHaveTextContent('Publicación creada')
    expect(onDismiss).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
