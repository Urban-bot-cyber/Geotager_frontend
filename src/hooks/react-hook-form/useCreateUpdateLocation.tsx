import { zodResolver } from '@hookform/resolvers/zod'
import { LocationType } from 'models/location'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface CreateUpdateLocationFields {
    latitude: number
    longitude: number
    user_id: string
    image?: string
    id?: string
}

interface Props {
    defaultValues?: LocationType
}

export const useCreateUpdateLocationForm = ({ defaultValues }: Props) => {
    const CreateUpdateLocationSchema = z.object({
        latitude: z.number(),
        longitude: z.number(),
        user_id: z.string(),
        image: z.string(),
        id: z.string(),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        defaultValues: {
            latitude: 0,
            longitude: 0,
            user_id: '',
            image: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: zodResolver(CreateUpdateLocationSchema)
    })

    return {
        handleSubmit,
        errors,
        control,
        reset
    }
}

export type CreateUpdateLocationForm = ReturnType<typeof useCreateUpdateLocationForm>