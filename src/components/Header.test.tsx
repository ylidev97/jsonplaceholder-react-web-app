import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from './Header'

function mockSystemTheme(dark: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches: dark }) as unknown as typeof window.matchMedia
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    mockSystemTheme(false)
  })

  it('R5: shows the "MyEditorial" title', () => {
    render(<Header />)

    expect(screen.getByRole('heading', { name: 'MyEditorial' })).toBeInTheDocument()
  })

  it('R5: without a saved theme, uses the system preference (dark)', () => {
    mockSystemTheme(true)
    render(<Header />)

    expect(document.documentElement).toHaveClass('dark')
    expect(screen.getByRole('button', { name: 'Modo claro' })).toBeInTheDocument()
  })

  it('R5: without a saved theme, uses the system preference (light)', () => {
    render(<Header />)

    expect(document.documentElement).not.toHaveClass('dark')
    expect(screen.getByRole('button', { name: 'Modo oscuro' })).toBeInTheDocument()
  })

  it('R5: a saved theme wins over the system preference', () => {
    mockSystemTheme(true)
    localStorage.setItem('theme', 'light')
    render(<Header />)

    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('R5: the button toggles the theme and saves it in localStorage', async () => {
    render(<Header />)

    await userEvent.click(screen.getByRole('button', { name: 'Modo oscuro' }))

    expect(document.documentElement).toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    await userEvent.click(screen.getByRole('button', { name: 'Modo claro' }))

    expect(document.documentElement).not.toHaveClass('dark')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('R5: the chosen theme is restored after a reload', async () => {
    const { unmount } = render(<Header />)
    await userEvent.click(screen.getByRole('button', { name: 'Modo oscuro' }))
    unmount()
    document.documentElement.classList.remove('dark')

    render(<Header />)

    expect(document.documentElement).toHaveClass('dark')
  })
})
