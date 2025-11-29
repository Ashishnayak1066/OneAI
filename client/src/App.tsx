import { useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { LoginPage } from './components/LoginPage'
import { userAtom, isAuthLoadingAtom } from './store'

function App() {
  const [user, setUser] = useAtom(userAtom)
  const setIsAuthLoading = useSetAtom(isAuthLoadingAtom)

  useEffect(() => {
    fetch('/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user)
        } else {
          setUser(null)
        }
        setIsAuthLoading(false)
      })
      .catch(() => {
        setUser(null)
        setIsAuthLoading(false)
      })
  }, [setUser, setIsAuthLoading])

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <ChatArea />
    </div>
  )
}

export default App
