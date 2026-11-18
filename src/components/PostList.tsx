import { usePosts } from '../hooks/usePosts'

interface PostListProps {
  userId: number | null
}

export default function PostList({ userId }: PostListProps) {
  const { data: posts = [] } = usePosts(userId)

  if (userId === null) return null

  return (
    <section className="p-4">
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id}>
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
