import { usePosts } from '../hooks/usePosts'
import { capitalize } from '../utils/capitalize'
import StatusMessage from './StatusMessage'

interface PostListProps {
  userId: number | null
  authorName: string
  onWrite: () => void
}

export default function PostList({ userId, authorName, onWrite }: PostListProps) {
  const { data: posts = [], isPending, isError, refetch } = usePosts(userId)

  if (userId === null) return null

  if (isPending) return <StatusMessage type="loading" message="Cargando publicaciones…" />

  if (isError) {
    return (
      <StatusMessage
        type="error"
        message="No se pudieron cargar las publicaciones"
        onRetry={() => refetch()}
      />
    )
  }

  if (posts.length === 0) {
    return (
      <section role="status" className="p-4 text-center">
        <p className="font-semibold">Aún no hay publicaciones</p>
        <p className="mb-3 text-sm text-muted">{authorName} no ha publicado nada.</p>
        <button
          type="button"
          onClick={onWrite}
          className="rounded bg-accent px-4 py-2 text-accent-fg hover:bg-accent-hover focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          Escribir la primera publicación
        </button>
      </section>
    )
  }

  return (
    <section className="p-4">
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <h3 className="font-semibold">{capitalize(post.title)}</h3>
            <p className="text-muted">{capitalize(post.body)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
