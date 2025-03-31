import Axios, { AxiosRequestConfig } from 'axios'
import authStore from 'stores/auth.store'

export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: AxiosRequestConfig,
) {
  try {
    const authHeader = authStore.getAuthHeader()

    // Correctly define headers as a plain object (avoiding AxiosRequestHeaders issues)
    let contentType = 'application/json'
    if (input instanceof FormData) {
      contentType = 'multipart/form-data'
    }
    
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Accept': 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
      ...(options?.headers as Record<string, string>),
    }

    const response = await Axios.request<R>({
      baseURL: process.env.REACT_APP_LARAVEL_API_URL,
      url: path,
      method,
      data: input,
      headers, // Now using a plain object to avoid type conflicts
      withCredentials: true,
      ...options, // Spread additional options
    })

    return response
  } catch (error: any) {
    console.error(`API Request Error (${method} ${path}):`, error.response?.data || error.message)
    return error.response
  }
}


export * from './User'
export * from './Location'
export * from './Guess'
export * from './Log'