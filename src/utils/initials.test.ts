import { describe, expect, it } from 'vitest'
import { initials } from './initials'

describe('initials', () => {
  it('returns the first two initials in uppercase', () => {
    expect(initials('leanne graham')).toBe('LG')
    expect(initials('Nicholas Runolfsdottir V')).toBe('NR')
  })

  it('skips honorifics ending with a dot', () => {
    expect(initials('Mrs. Dennis Schulist')).toBe('DS')
  })

  it('handles a single word', () => {
    expect(initials('Madonna')).toBe('M')
  })
})
