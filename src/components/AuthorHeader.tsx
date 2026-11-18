import { usePosts } from '../hooks/usePosts'
import type { User } from '../types/user'
import { PlusIcon } from './Icons'
import { btnPrimary } from './styles'

interface AuthorHeaderProps {
  user: User
  onNewPost: () => void
}

export default function AuthorHeader({ user, onNewPost }: AuthorHeaderProps) {
  // Same query as PostList, so the request is shared and cached.
  const { data: posts, isSuccess } = usePosts(user.id)
  const kicker = isSuccess
    ? `${posts.length} ${posts.length === 1 ? 'publicación' : 'publicaciones'}`
    : 'Autor'

  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-b border-line pb-5">
      <div className="min-w-0 flex-[1_1_260px]">
        <div className="text-[11px] tracking-widest text-accent-strong uppercase tabular-nums">
          {kicker}
        </div>
        <h2 className="mt-1.5 mb-1 text-4xl leading-[1.05] font-normal md:text-[40px]">
          {user.name}
        </h2>
        <a
          href={`mailto:${user.email}`}
          className="text-sm break-all text-muted no-underline hover:text-accent-strong"
        >
          {user.email}
        </a>
      </div>
      <button type="button" onClick={onNewPost} className={`${btnPrimary} min-h-11 px-5`}>
        <PlusIcon size={16} />
        Nueva publicación
      </button>
    </div>
  )
}
