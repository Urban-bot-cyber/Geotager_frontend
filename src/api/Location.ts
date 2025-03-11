import { LocationType, LocationTypeId } from 'models/location'
import { apiRequest } from './Api'
import { apiRoutes } from 'constants/apiConstants'
import { CreateUpdateLocationFields } from 'hooks/react-hook-form/useCreateUpdateLocation'
import authStore from 'stores/auth.store' 


export const getLocations = async (pageNumber: number) =>
    apiRequest<never, LocationType>(
      'get',
      `${apiRoutes.LOCATIONS_PREFIX}?page=${pageNumber}`,
    )
  
  export const getLocation = async (id: number) =>
    apiRequest<undefined, LocationType>(
      'get',
      `${apiRoutes.LOCATIONS_PREFIX}/${id}`,
    )

    export const getRandomLocation = async () =>
        apiRequest<undefined, LocationType>(
          'get',
          `${apiRoutes.LOCATIONS_PREFIX}/random`,
        )

    export const getLocationById = async (id: string) =>
        apiRequest<undefined, LocationType>(
            'get',
            `${apiRoutes.LOCATIONS_PREFIX}/${id}`
        )

    export const getLocationsByUserId = async (id: string) =>
        apiRequest<undefined, LocationType[]>(
            'get',
            `${apiRoutes.LOCATIONS_PREFIX}/${id}`
        )
  
    export const createLocation = async (data: CreateUpdateLocationFields) =>
    apiRequest<CreateUpdateLocationFields, void>(
      'post',
      apiRoutes.LOCATIONS_PREFIX,
      data,
    )
  
  export const updateLocation = async (data: CreateUpdateLocationFields, id: string) =>
    apiRequest<CreateUpdateLocationFields, void>(
      'patch',
      `${apiRoutes.LOCATIONS_PREFIX}/${id}`,
      data,
    )
  
  export const deleteLocation = async (id: string) =>
    apiRequest<number, LocationType>(
      'delete',
      `${apiRoutes.LOCATIONS_PREFIX}/${id}`,
    )
  
  export const currentUserLocations = async (pageNumber: number) =>
    apiRequest<never, LocationType[]>(
      'get',
      `${apiRoutes.LOCATIONS_PREFIX}/me?page=${pageNumber}`,
    )

    export const uploadImage = async (id: string,data: CreateUpdateLocationFields) =>
        apiRequest<number, LocationType>(
          'delete',
          `${apiRoutes.LOCATIONS_PREFIX}/${id}/image`,
        )
