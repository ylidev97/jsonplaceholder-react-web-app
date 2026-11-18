import { api } from './client'
import type { Post } from '../types/post'

export const getPostsByUser = async (userId: number): Promise<Post[]> => {
  const { data } = await api.get<Post[]>('/posts', { params: { userId } })
  return data
}
