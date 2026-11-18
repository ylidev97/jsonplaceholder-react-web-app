import { api } from './client'
import type { NewPost, Post } from '../types/post'

export const getPostsByUser = async (userId: number): Promise<Post[]> => {
  const { data } = await api.get<Post[]>('/posts', { params: { userId } })
  return data
}

export const createPost = async (post: NewPost): Promise<Post> => {
  const { data } = await api.post<Post>('/posts', post)
  return data
}
