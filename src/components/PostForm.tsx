import { useState } from 'react'
import { useCreatePost } from '../hooks/useCreatePost'

interface PostFormProps {
  userId: number | null
}

const inputClass =
  'w-full rounded border border-gray-300 px-3 py-2 focus:outline-2 focus:outline-blue-600'

export default function PostForm({ userId }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [titleError, setTitleError] = useState('')
  const [bodyError, setBodyError] = useState('')
  const { mutate, isPending } = useCreatePost()

  if (userId === null) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newTitle = title.trim()
    const newBody = body.trim()

    setTitleError(newTitle ? '' : 'El título es obligatorio')
    setBodyError(newBody ? '' : 'El texto es obligatorio')
    if (!newTitle || !newBody) return

    mutate(
      { userId: userId!, title: newTitle, body: newBody },
      {
        onSuccess: () => {
          setTitle('')
          setBody('')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 p-4">
      <div>
        <label htmlFor="post-title" className="mb-1 block text-sm font-medium">
          Título
        </label>
        <input
          id="post-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={titleError !== ''}
          aria-describedby={titleError ? 'post-title-error' : undefined}
          className={inputClass}
        />
        {titleError && (
          <p id="post-title-error" role="alert" className="mt-1 text-sm text-red-600">
            {titleError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="post-body" className="mb-1 block text-sm font-medium">
          Texto
        </label>
        <textarea
          id="post-body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-invalid={bodyError !== ''}
          aria-describedby={bodyError ? 'post-body-error' : undefined}
          className={inputClass}
        />
        {bodyError && (
          <p id="post-body-error" role="alert" className="mt-1 text-sm text-red-600">
            {bodyError}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 disabled:opacity-50"
      >
        Publicar
      </button>
    </form>
  )
}
