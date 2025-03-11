import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export interface RegisterUserFields {
    first_name: string
    last_name: string
    email: string
    password: string
    confirm_password: string
}

export const useRegisterForm = () => {
    const RegisterSchema = z
        .object({
            first_name: z.string().min(1, 'First name is required'),
            last_name: z.string().min(1, 'Last name is required'),
            email: z.string().email('Please enter a valid email'),
            password: z
                .string()
                .min(6, 'Password must be at least 6 characters long')
                .regex(
                    /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}$/,
                    'Password must contain at least one number and one letter.'
                ),
            confirm_password: z
                .string()
                .min(1, 'Passwords do not match')
        })
        .refine((data) => data.password === data.confirm_password, {
            message: 'Passwords do not match',
            path: ['confirm_password'],
        })

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
        },
        mode: 'onSubmit',
        resolver: zodResolver(RegisterSchema),
    })

    return {
        handleSubmit,
        errors,
        control,
    }
}

export type RegisterForm = ReturnType<typeof useRegisterForm>