import { LocationType, LocationTypeId } from 'models/location'
import { apiRequest } from './Api'
import { apiRoutes } from 'constants/apiConstants'
import { CreateUpdateLocationFields } from 'hooks/react-hook-form/useCreateUpdateLocation'
import authStore from 'stores/auth.store' 


export const getLocations = async (pageNumber: number) =>
  apiRequest<never, LocationType>(
    'get',
    `${apiRoutes.LOCATIONS_PREFIX}?page=${pageNumber}`,
    undefined, // No request body for GET
    {
      headers: {
        Authorization: `Bearer ${authStore.token}` // Ensure authentication
      }
    }
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
            `${apiRoutes.LOCATIONS_PREFIX}/${id}`,
            undefined, // No request body for GET
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.token}` // Ensures authentication is included
              }
            }
        )

    export const getLocationsByUserId = async (id: string) =>
        apiRequest<undefined, LocationType[]>(
            'get',
            `${apiRoutes.LOCATIONS_PREFIX}/${id}`
        )
  
        export const createLocation = async (data: CreateUpdateLocationFields, file?: File) => {
          const formData = new FormData()
          
          formData.append('latitude', data.latitude.toString())
          formData.append('longitude', data.longitude.toString())
          formData.append('user_id', data.user_id.toString())
      
          if (file) {
              formData.append('image', file, file.name)
          }
      
          return apiRequest<FormData, void>(
              'post',
              apiRoutes.LOCATIONS_PREFIX,
              formData,
              {
                  headers: {
                      'Content-Type': 'multipart/form-data', 
                      Authorization: `Bearer ${authStore.token}` // Ensure Authorization is included
                  }
              }
          )
      }
  
      export const updateLocation = async (
        data: CreateUpdateLocationFields, 
        id: string, 
        file?: File
      ) => {
        const formData = new FormData()
      
        // Append each field from data to the FormData
        Object.keys(data).forEach((key) => {
          const value = data[key as keyof CreateUpdateLocationFields]
          if (value !== undefined) {
            formData.append(key, value.toString())
          }
        })
      
        // Append file if provided
        if (file) {
          formData.append('image', file)
        }
      
        return apiRequest<FormData, void>(
          'put',
          `${apiRoutes.LOCATIONS_PREFIX}/${id}`,
          formData,
          {
            headers: {
              // Do not set Content-Type explicitly when sending FormData
              Authorization: `Bearer ${authStore.token}`,
            }
          }
        )
      }
  
    export const deleteLocation = (id: number) =>
      apiRequest<never, void>(
        'delete',
        `/locations/${id}`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      )
  
    export const currentUserLocations = async (pageNumber: number, perPage = 3)  =>
      apiRequest<never, any>(
        'get',
        `${apiRoutes.LOCATIONS_PREFIX}/me?page=${pageNumber}&perPage=${perPage}`,
        undefined,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authStore.token}`,
          }
        }
      )

    export const uploadImage = async (id: string,data: CreateUpdateLocationFields) =>
        apiRequest<number, LocationType>(
          'post',
          `${apiRoutes.LOCATIONS_PREFIX}/${id}/image`,
        )
