export interface Post {
  id: number
  userId: number
  title: string
  body: string
  // Set on posts created in this session, to show the "Recién publicada" tag.
  isNew?: boolean
}

export type NewPost = Omit<Post, 'id' | 'isNew'>
