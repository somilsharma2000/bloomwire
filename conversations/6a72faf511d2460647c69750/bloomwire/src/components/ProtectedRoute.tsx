import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const user = useAuth((s) => s.user)
  const location = useLocation()
  const showToast = useToastStore((s) => s.showToast)

  if (!user) {
    showToast('Please sign in to access this page', 'auth')
    return <Navigate to={`/#/login?redirect=${encodeURIComponent(location.pathname)}`} state={{ from: location.pathname, requireAuth: true }} replace />
  }

  return <>{children}</>
}
