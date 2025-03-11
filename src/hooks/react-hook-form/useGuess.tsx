import { zodResolver } from '@hookform/resolvers/zod'
import { GuessType } from 'models/guess'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface CreateUpdateGuessFields {
    latitude: number
    longitude: number
    user_id: string
    location_id: string
}

interface Props {
    defaultValues?: GuessType
}

export const useCreateUpdateGuessForm = ({ defaultValues }: Props) => {
    const CreateUpdateGuessSchema = z.object({
        latitude: z.number(),
        longitude: z.number(),
        user_id: z.string(),
        location_id: z.string(),
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
            location_id: '',
            ...defaultValues,
        },
        mode: 'onSubmit',
        resolver: zodResolver(CreateUpdateGuessSchema)
    })

    return {
        handleSubmit,
        errors,
        control,
        reset
    }
}

export type CreateUpdateGuessForm = ReturnType<typeof useCreateUpdateGuessForm>