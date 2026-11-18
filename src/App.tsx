import { useState } from 'react'
import UserList from './components/UserList'
import PostList from './components/PostList'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <main>
      <h1 className="p-4 text-3xl font-semibold">MyEditorial</h1>
      <div className="flex">
        <div className="w-1/3">
          <UserList selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
        </div>
        <div className="w-2/3">
          <PostList userId={selectedUserId} />
        </div>
      </div>
    </main>
  )
}

export default App
