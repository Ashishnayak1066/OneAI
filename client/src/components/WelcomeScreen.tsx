import { useAtom } from 'jotai'
import { userAtom } from '../store'

export function WelcomeScreen() {
  const [user] = useAtom(userAtom)

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-700 mb-2">
          Trimodels
        </h1>
        <p className="text-2xl text-slate-600">
          Welcome {user?.displayName || 'Guest'}
        </p>
      </div>
    </div>
  )
}
