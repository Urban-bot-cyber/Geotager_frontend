import { apiRoutes } from '../constants/apiConstants'
import { LoginUserFields } from '../hooks/react-hook-form/useLogin'
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister'
import { UserType } from '../models/auth'
import { apiRequest } from './Api'
import authStore from '../stores/auth.store'



export const logUserAction = async (payload: any, token: string) =>
    apiRequest<any, any>(
      'post',
      `${apiRoutes.USER_ACTIONS}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      }
    )

    export const getRecentUserActions = async (): Promise<any> =>
        apiRequest<never, any>(
          'get',
          `${apiRoutes.ADMIN_USER_ACTIONS}`, // Ensure this constant is defined as '/api/admin/user-actions'
          undefined,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        )