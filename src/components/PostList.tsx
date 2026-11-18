import { useState } from 'react'
import { usePosts } from '../hooks/usePosts'
import { capitalize } from '../utils/capitalize'
import { ChevronDownIcon } from './Icons'
import StatusMessage from './StatusMessage'
import { btnPrimary, btnSecondary } from './styles'

const VISIBLE_POSTS = 4

interface PostListProps {
  userId: number | null
  authorName: string
  onWrite: () => void
}

export default function PostList({ userId, authorName, onWrite }: PostListProps) {
  const { data: posts = [], isPending, isError, refetch } = usePosts(userId)
  // Remember which author is expanded, so choosing another author goes back to 4 posts.
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null)

  if (userId === null) return null

  if (isPending) {
    return <StatusMessage type="loading" skeleton="posts" message="Cargando publicaciones…" />
  }

  if (isError) {
    return (
      <StatusMessage
        type="error"
        message="No se pudieron cargar las publicaciones"
        description="El servidor no respondió a tiempo."
        onRetry={() => refetch()}
      />
    )
  }

  if (posts.length === 0) {
    return (
      <div role="status" className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="font-heading text-[26px] italic">Aún no hay publicaciones</p>
        <p className="text-sm text-muted">{authorName} no ha publicado nada.</p>
        <button type="button" onClick={onWrite} className={`${btnPrimary} mt-2.5 min-h-11`}>
          Escribir la primera publicación
        </button>
      </div>
    )
  }

  const expanded = expandedUserId === userId
  const visiblePosts = expanded ? posts : posts.slice(0, VISIBLE_POSTS)

  return (
    <div>
      <ul>
        {visiblePosts.map((post) => (
          <li key={post.id} className="flex flex-col gap-1.5 border-b border-line py-5.5">
            {post.isNew && (
              <span className="self-start rounded-[3px] bg-accent/15 px-2.5 py-0.5 text-[11px] tracking-wide text-accent-strong">
                Recién publicada
              </span>
            )}
            <h3 className="text-2xl leading-[1.15] text-pretty">{capitalize(post.title)}</h3>
            <p className="hyphens-auto text-justify text-[14.5px] leading-relaxed text-fg/80">
              {capitalize(post.body)}
            </p>
          </li>
        ))}
      </ul>

      {posts.length > VISIBLE_POSTS && (
        <div className="flex justify-center pt-5">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpandedUserId(expanded ? null : userId)}
            className={`${btnSecondary} min-h-11 px-5`}
          >
            {expanded ? 'Mostrar menos' : 'Mostrar más'}
            <ChevronDownIcon size={16} className={expanded ? 'rotate-180' : ''} />
          </button>
        </div>
      )}
    </div>
  )
}
