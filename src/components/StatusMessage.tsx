import { AlertCircleIcon, RefreshIcon } from './Icons'
import { btnPrimary } from './styles'

type StatusMessageProps =
  | { type: 'loading'; message: string; skeleton?: 'authors' | 'posts' }
  | { type: 'error'; message: string; description?: string; onRetry: () => void }

const bar = 'rounded-sm bg-fg/12'

function AuthorsSkeleton() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-3.5 p-3">
          <div className="size-10.5 flex-none rounded-full bg-fg/10" />
          <div className="flex flex-1 flex-col gap-2">
            <div className={`h-3 w-[55%] ${bar}`} />
            <div className="h-2.5 w-3/4 rounded-sm bg-fg/8" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex animate-pulse flex-col gap-2.5 border-b border-line py-5.5">
          <div className={`h-4.5 w-[62%] ${bar}`} />
          <div className="h-2.5 w-full rounded-sm bg-fg/8" />
          <div className="h-2.5 w-[84%] rounded-sm bg-fg/8" />
        </div>
      ))}
    </div>
  )
}

export default function StatusMessage(props: StatusMessageProps) {
  if (props.type === 'loading') {
    return (
      <div role="status">
        {props.skeleton === 'authors' && <AuthorsSkeleton />}
        {props.skeleton === 'posts' && <PostsSkeleton />}
        <p className="px-3 py-2 text-[13px] text-muted italic">{props.message}</p>
      </div>
    )
  }

  return (
    <div role="alert" className="m-3 flex flex-col gap-2.5 rounded border border-danger p-4">
      <div className="flex items-center gap-2.5 text-danger">
        <AlertCircleIcon size={20} className="flex-none" />
        <p className="font-heading text-xl leading-tight font-semibold">{props.message}</p>
      </div>
      {props.description && <p className="text-sm text-fg/80">{props.description}</p>}
      <div>
        <button type="button" onClick={props.onRetry} className={btnPrimary}>
          <RefreshIcon size={15} />
          Reintentar
        </button>
      </div>
    </div>
  )
}
