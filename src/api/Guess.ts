import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import { CreateUpdateGuessFields } from 'hooks/react-hook-form/useGuess'
import authStore from 'stores/auth.store'


const getToken = () => authStore?.token || ''

export const submitGuess = async (locationId: number, latitude: number, longitude: number) => {
  return apiRequest(
    'post',
    `${apiRoutes.GUESSES_PREFIX}/guess/${locationId}`,
    { latitude, longitude },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      }
    }
  )
}


 export const createGuess = async (data: CreateUpdateGuessFields, id: string) =>
    apiRequest<CreateUpdateGuessFields, void>(
      'post',
     `${apiRoutes.LOCATIONS_PREFIX}/guess/${id}`,
      data,
    )

    export const getBestGuesses = async (limit: number) => {
      return apiRequest(
        'get',
        `${apiRoutes.GUESSES_PREFIX}/best?limit=${limit}`,
        undefined,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`
          }
        }
      )
    }

  export const getBestGuessesByLocation = async (locationId: number, limit = 1) => {
    return apiRequest(
      'get',
      `${apiRoutes.GUESSES_PREFIX}/${locationId}?limit=${limit}`,
      undefined,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        }
      }
    )
  }