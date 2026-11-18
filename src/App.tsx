import { useState } from 'react'
import UserList from './components/UserList'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import { useUsers } from './hooks/useUsers'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { data: users = [] } = useUsers()
  const selectedUser = users.find((user) => user.id === selectedUserId)

  return (
    <main>
      <h1 className="p-4 text-3xl font-semibold">MyEditorial</h1>
      <div className="flex">
        <div className="w-1/3">
          <UserList selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
        </div>
        <div className="w-2/3">
          <PostList
            userId={selectedUserId}
            authorName={selectedUser?.name ?? ''}
            onWrite={() => document.getElementById('post-title')?.focus()}
          />
          <PostForm userId={selectedUserId} />
        </div>
      </div>
    </main>
  )
}

export default App
