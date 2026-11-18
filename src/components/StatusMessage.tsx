type StatusMessageProps =
  | { type: 'loading'; message: string }
  | { type: 'error'; message: string; onRetry: () => void }

export default function StatusMessage(props: StatusMessageProps) {
  if (props.type === 'loading') {
    return (
      <p role="status" className="p-4 text-muted">
        {props.message}
      </p>
    )
  }

  return (
    <div role="alert" className="p-4">
      <p className="mb-2 text-danger">{props.message}</p>
      <button
        type="button"
        onClick={props.onRetry}
        className="rounded border border-line px-3 py-1 hover:bg-hover focus:outline-2 focus:outline-accent"
      >
        Reintentar
      </button>
    </div>
  )
}
