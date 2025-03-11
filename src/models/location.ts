export type LocationType = {
    id: string
    image: string
    latitude: number
    longitude: number
    user?: {
        id: string
        first_name: string
        last_name: string
        avatar: string
    }
}

export type LocationTypeId = {
    id: string
    image: string
    latitude: number
    longitude: number
    user_id?: string
}

