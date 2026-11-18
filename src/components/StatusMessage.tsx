type StatusMessageProps =
  | { type: 'loading'; message: string }
  | { type: 'error'; message: string; onRetry: () => void }

export default function StatusMessage(props: StatusMessageProps) {
  if (props.type === 'loading') {
    return (
      <p role="status" className="p-4 text-gray-600">
        {props.message}
      </p>
    )
  }

  return (
    <div role="alert" className="p-4">
      <p className="mb-2 text-red-600">{props.message}</p>
      <button
        type="button"
        onClick={props.onRetry}
        className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100 focus:outline-2 focus:outline-blue-600"
      >
        Reintentar
      </button>
    </div>
  )
}
