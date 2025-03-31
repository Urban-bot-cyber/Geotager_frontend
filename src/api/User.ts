import { apiRoutes } from '../constants/apiConstants'
import { LoginUserFields } from '../hooks/react-hook-form/useLogin'
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister'
import { UserType } from '../models/auth'
import { apiRequest } from './Api'
import axios from 'axios'
import authStore from 'stores/auth.store'


export const fetchUser = async () =>
  apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER)

export const getUser = async (id: string) =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.USERS_PREFIX}/${id}`)

export const currentUser = async () =>
  apiRequest<undefined, UserType>('get', `${apiRoutes.FETCH_USER}`)

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const signup = async (data: RegisterUserFields) =>
  apiRequest<RegisterUserFields, UserType>('post', apiRoutes.SIGNUP, data)

export const signin = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )
  

  export async function updateUser(data: FormData) {
    const token = authStore.token // Must be non-empty & valid
  
    // Add the _method field to spoof a PUT request
    if (!data.has('_method')) {
      data.append('_method', 'PUT')
    }
  
    return axios.post('/api/update', data, {
      baseURL: process.env.REACT_APP_LARAVEL_API_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  export async function updatePassword(data: FormData) {
    const token = authStore.token // Must be non-empty & valid
  
    // Add the _method field to spoof a PUT request if not present
    if (!data.has('_method')) {
      data.append('_method', 'PUT')
    }
  
    return axios.post('/api/update-password', data, {
      baseURL: process.env.REACT_APP_LARAVEL_API_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  export async function updateProfilePicture(formData: FormData) {
    const token = authStore.token
    return axios.post('/api/update-profile-picture', formData, {
      baseURL: process.env.REACT_APP_LARAVEL_API_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    })
  }
export const deleteUser = async (id: string) =>
  apiRequest<string, UserType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)


export const addPoints = async (id: string) =>
  apiRequest<undefined, UserType>('post', `${apiRoutes.USERS_PREFIX}/${id}/add-points`)