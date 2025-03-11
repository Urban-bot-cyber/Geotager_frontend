export type GuessType = {
    id: string
    latitude: number
    longitude: number
    error_distance?: number
    user?: {
        id: string
        first_name: string
        last_name: string
        avatar: string
    }
    location?:{
        id:string
        image:string
        longitude:number
        latitude:number

    }
}

export type GuessTypeID = {
    id: string
    latitude: number
    longitude: number
    error_distance?: number
    user_id?: string
    location_id?:string
}

