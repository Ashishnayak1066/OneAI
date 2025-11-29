import { useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { Route, Switch } from 'wouter'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { AuthProvider, useAuth } from './context/AuthContext'
import { userAtom, isAuthLoadingAtom } from './store'

function MainApp() {
  const [user, setUser] = useAtom(userAtom)
  const setIsAuthLoading = useSetAtom(isAuthLoadingAtom)
  const { isAuthenticated, isLoading, user: authUser } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (authUser) {
        setUser(authUser)
      } else {
        setUser(null)
      }
      setIsAuthLoading(false)
    }
  }, [authUser, isLoading, setUser, setIsAuthLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/signup" component={SignUp} />
        <Route component={Login} />
      </Switch>
    )
  }

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <ChatArea />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App
