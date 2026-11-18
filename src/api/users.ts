import { api } from './client'
import type { User } from '../types/user'

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/users')
  return data
}
