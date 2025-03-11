import { apiRoutes } from 'constants/apiConstants'
import { apiRequest } from './Api'
import { CreateUpdateGuessFields } from 'hooks/react-hook-form/useGuess'


 export const createGuess = async (data: CreateUpdateGuessFields, id: string) =>
    apiRequest<CreateUpdateGuessFields, void>(
      'post',
     `${apiRoutes.LOCATIONS_PREFIX}/guess/${id}`,
      data,
    )

    export const getBestGuesses = async (limit: number) =>
      apiRequest<void, any>('get', `${apiRoutes.GUESSES_PREFIX}/best`, undefined, {
        params: { limit },
      })
    