// useAuth.ts
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authStore from 'stores/auth.store'
import axios from 'axios'

const useAuth = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // On mount, check if user is authenticated
    // This route returns user data if authenticated, or 401 if not
    axios.get('/api/user')
      .then(response => {
        authStore.login(response.data)
      })
      .catch(error => {
        if (error.response.status === 401) {
          authStore.signout()
          navigate('/login')
        }
      })
  }, [navigate])


}

export default useAuth