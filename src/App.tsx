import { useState } from 'react'
import UserList from './components/UserList'
import PostList from './components/PostList'
import PostForm from './components/PostForm'
import Header from './components/Header'
import { useUsers } from './hooks/useUsers'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const { data: users = [] } = useUsers()
  const selectedUser = users.find((user) => user.id === selectedUserId)

  return (
    <>
      <Header />
      <main className="flex">
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
      </main>
    </>
  )
}

export default App
