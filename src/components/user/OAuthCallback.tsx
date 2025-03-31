import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'

const OAuthCallback: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('access_token')
    if (token) {
      // Save token in authStore or localStorage
      authStore.setToken(token)
      // Redirect to the protected route
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }, [location, navigate])

  return <div>Loading...</div>
}

export default OAuthCallback