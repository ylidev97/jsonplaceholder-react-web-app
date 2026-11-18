import { useQuery } from '@tanstack/react-query'
import { getPostsByUser } from '../api/posts'

export function usePosts(userId: number | null) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => getPostsByUser(userId!),
    enabled: userId !== null,
  })
}
