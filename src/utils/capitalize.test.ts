import { describe, expect, it } from 'vitest'
import { capitalize } from './capitalize'

describe('capitalize', () => {
  it('uppercases only the first letter', () => {
    expect(capitalize('hello world')).toBe('Hello world')
  })

  it('keeps already capitalized text and handles an empty string', () => {
    expect(capitalize('Hello')).toBe('Hello')
    expect(capitalize('')).toBe('')
  })
})
