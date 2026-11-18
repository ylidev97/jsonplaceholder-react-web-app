import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/posts'
import type { Post } from '../types/post'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    // JSONPlaceholder does not persist the post, so we add it to the cache
    // instead of refetching the list. It also returns id 101 for every POST,
    // so we make the id unique to avoid duplicated React keys.
    onSuccess: (created, variables) => {
      queryClient.setQueryData<Post[]>(['posts', variables.userId], (old = []) => {
        const idTaken = old.some((post) => post.id === created.id)
        const id = idTaken ? Math.max(...old.map((post) => post.id)) + 1 : created.id
        return [{ ...created, id }, ...old]
      })
    },
  })
}
