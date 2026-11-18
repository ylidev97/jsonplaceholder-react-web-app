import { useRef, useState } from 'react'
import { useCreatePost } from '../hooks/useCreatePost'
import { XIcon } from './Icons'
import StatusMessage from './StatusMessage'
import { btnGhost, btnPrimary, btnSecondary, inputClass } from './styles'

const TITLE_MAX = 100

interface PostFormProps {
  userId: number
  authorName: string
  onClose: () => void
  onPublished: () => void
}

function validate(title: string, body: string) {
  const trimmedTitle = title.trim()
  return {
    title: !trimmedTitle
      ? 'El título es obligatorio'
      : trimmedTitle.length > TITLE_MAX
        ? `Usa menos de ${TITLE_MAX} caracteres`
        : '',
    body: body.trim() ? '' : 'El texto es obligatorio',
  }
}

const labelClass = "mb-1.5 block text-[13px] text-fg/70 after:ml-1 after:text-danger after:content-['*']"

export default function PostForm({ userId, authorName, onClose, onPublished }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [touched, setTouched] = useState({ title: false, body: false })
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const { mutate, isPending, isError } = useCreatePost()

  // Errors show once a field has been touched, and update while the user types.
  const errors = validate(title, body)
  const titleError = touched.title ? errors.title : ''
  const bodyError = touched.body ? errors.body : ''
  const titleLength = title.trim().length
  const words = body.trim() ? body.trim().split(/\s+/).length : 0

  function close() {
    if (!isPending) onClose()
  }

  function submit() {
    if (isPending) return
    setTouched({ title: true, body: true })
    if (errors.title) return titleRef.current?.focus()
    if (errors.body) return bodyRef.current?.focus()

    mutate({ userId, title: title.trim(), body: body.trim() }, { onSuccess: onPublished })
  }

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/55 md:items-center md:p-6"
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-form-title"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-[min(540px,100%)] flex-col gap-4.5 overflow-y-auto rounded-t-lg border border-line bg-surface p-6 shadow-lg md:rounded-lg"
      >
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 id="post-form-title" className="text-[28px]">
              Nueva publicación
            </h2>
            <p className="mt-0.5 text-[13px] text-fg/70">Publicando como {authorName}</p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={isPending}
            aria-label="Cerrar"
            className={`${btnGhost} -mt-2 -mr-2 size-11 min-h-0 px-0 py-0 text-fg`}
          >
            <XIcon size={18} />
          </button>
        </div>

        {isError && (
          <StatusMessage
            type="error"
            message="No se pudo publicar"
            description="El servidor no respondió. Tu borrador se conserva; inténtalo de nuevo."
            onRetry={submit}
          />
        )}

        <div>
          <label htmlFor="post-title" className={labelClass}>
            Título
          </label>
          <input
            id="post-title"
            ref={titleRef}
            autoFocus
            value={title}
            disabled={isPending}
            placeholder="Un titular claro y concreto"
            onChange={(e) => {
              setTitle(e.target.value)
              setTouched((t) => ({ ...t, title: true }))
            }}
            onBlur={() => title !== '' && setTouched((t) => ({ ...t, title: true }))}
            aria-required="true"
            aria-invalid={titleError !== ''}
            aria-describedby={titleError ? 'post-title-error' : undefined}
            className={`${inputClass} ${titleError ? 'border-danger' : ''}`}
          />
          <div className="mt-1.5 flex min-h-4.5 justify-between gap-3 text-[12.5px]">
            <span>
              {titleError && (
                <span id="post-title-error" role="alert" className="text-danger">
                  {titleError}
                </span>
              )}
            </span>
            <span
              className={`flex-none tabular-nums ${titleLength > TITLE_MAX ? 'text-danger' : 'text-muted'}`}
            >
              {titleLength}/{TITLE_MAX}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="post-body" className={labelClass}>
            Texto
          </label>
          <textarea
            id="post-body"
            ref={bodyRef}
            rows={6}
            value={body}
            disabled={isPending}
            placeholder="Escribe tu publicación…"
            onChange={(e) => {
              setBody(e.target.value)
              setTouched((t) => ({ ...t, body: true }))
            }}
            onBlur={() => body !== '' && setTouched((t) => ({ ...t, body: true }))}
            aria-required="true"
            aria-invalid={bodyError !== ''}
            aria-describedby={bodyError ? 'post-body-error' : undefined}
            className={`${inputClass} min-h-37.5 leading-relaxed ${bodyError ? 'border-danger' : ''}`}
          />
          <div className="mt-1.5 flex min-h-4.5 justify-between gap-3 text-[12.5px]">
            <span>
              {bodyError && (
                <span id="post-body-error" role="alert" className="text-danger">
                  {bodyError}
                </span>
              )}
            </span>
            <span className="flex-none text-muted tabular-nums">
              {words} {words === 1 ? 'palabra' : 'palabras'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="mr-auto text-xs text-muted">* Obligatorio</span>
          <button type="button" onClick={close} disabled={isPending} className={`${btnSecondary} min-h-11 px-4.5`}>
            Cancelar
          </button>
          <button type="submit" disabled={isPending} className={`${btnPrimary} min-h-11 min-w-30 px-5`}>
            {isPending && (
              <span
                aria-hidden="true"
                className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent"
              />
            )}
            {isPending ? 'Publicando…' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  )
}
