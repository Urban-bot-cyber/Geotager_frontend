import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export interface LoginUserFields {
    email: string
    password: string
}

export const useLoginForm = () => {
    const LoginSchema = z.object({
        email: z.string().email({ message: 'Please enter a valid email.' }),
        password: z.string().min(1, { message: 'Password field cannot be empty' }),
    })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
        resolver: zodResolver(LoginSchema),
    })

    return { handleSubmit, errors, control }
}

export type LoginForm = ReturnType<typeof useLoginForm>