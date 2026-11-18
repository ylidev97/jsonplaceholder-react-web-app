import { useEffect } from 'react'
import { CheckIcon } from './Icons'

interface ToastProps {
  message: string
  onDismiss: () => void
}

export default function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2600)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5 rounded border border-accent bg-surface px-4.5 py-3 text-sm whitespace-nowrap shadow-md"
    >
      <CheckIcon size={16} className="text-accent" />
      {message}
    </div>
  )
}
