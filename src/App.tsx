import { useState } from 'react'
import AuthorHeader from './components/AuthorHeader'
import Header from './components/Header'
import PostForm from './components/PostForm'
import PostList from './components/PostList'
import Toast from './components/Toast'
import UserList from './components/UserList'
import { useUsers } from './hooks/useUsers'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const { data: users = [] } = useUsers()
  const selectedUser = users.find((user) => user.id === selectedUserId)

  // On phones only one screen shows at a time: the author list, or the selected author's posts.
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header onBack={selectedUser ? () => setSelectedUserId(null) : undefined} />

      <div className="grid min-h-0 flex-1 md:grid-cols-[360px_minmax(0,1fr)]">
        <aside
          aria-label="Autores"
          className={`min-h-0 flex-col border-r border-line ${selectedUser ? 'hidden md:flex' : 'flex'}`}
        >
          <UserList selectedUserId={selectedUserId} onSelect={setSelectedUserId} />
        </aside>

        <main className={`min-h-0 min-w-0 overflow-y-auto ${selectedUser ? 'block' : 'hidden md:block'}`}>
          {selectedUser ? (
            <div className="mx-auto max-w-3xl px-5 pt-6 pb-10 md:px-12 md:pt-10 md:pb-14">
              <AuthorHeader user={selectedUser} onNewPost={() => setFormOpen(true)} />
              <PostList
                userId={selectedUser.id}
                authorName={selectedUser.name}
                onWrite={() => setFormOpen(true)}
              />
            </div>
          ) : (
            <div className="grid h-full place-items-center p-10">
              <div className="flex max-w-85 flex-col items-center gap-2.5 text-center">
                <div className="h-px w-14 bg-accent" />
                <p className="mt-1.5 font-heading text-3xl leading-[1.15] italic">Elige un autor</p>
                <p className="text-sm text-pretty text-muted">
                  Selecciona a alguien de la lista para leer sus publicaciones o escribir una nueva en
                  su nombre.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {formOpen && selectedUser && (
        <PostForm
          userId={selectedUser.id}
          authorName={selectedUser.name}
          onClose={() => setFormOpen(false)}
          onPublished={() => {
            setFormOpen(false)
            setToast('Publicación creada')
          }}
        />
      )}

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}

export default App
