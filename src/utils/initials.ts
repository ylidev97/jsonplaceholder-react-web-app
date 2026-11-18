// "Mrs. Dennis Schulist" -> "DS": skips honorifics like "Mrs." and keeps the first two initials.
export function initials(name: string) {
  return name
    .split(' ')
    .filter((word) => word && !word.endsWith('.'))
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
