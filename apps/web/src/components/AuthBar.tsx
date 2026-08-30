import { LogOut } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function AuthBar() {
  const { user, logout } = useAuth()

  return (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2.5 border border-rgx-border bg-rgx-surface/90 px-3 py-1.5 font-mono text-[11px] text-rgx-muted">
      <span>{user?.email}</span>
      <button
        onClick={logout}
        aria-label="Se déconnecter"
        className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-rgx-muted-2 hover:text-rgx-danger"
      >
        <LogOut size={13} />
      </button>
    </div>
  )
}
