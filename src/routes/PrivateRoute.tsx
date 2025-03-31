import authStore from 'stores/auth.store'
import { FC, useEffect, useState } from 'react'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'

const PrivateRoute: FC<RouteProps> = ({ children }: RouteProps) => {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(!!authStore.user)
  
  useEffect(() => {
    // Check authentication status initially and set up regular checks
    setIsAuthenticated(!!authStore.user)
    
    // Simple polling approach - not ideal but works without mobx-react
    const interval = setInterval(() => {
      setIsAuthenticated(!!authStore.user)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
      />
    )
  }
  
  return children as JSX.Element
}

export default PrivateRoute