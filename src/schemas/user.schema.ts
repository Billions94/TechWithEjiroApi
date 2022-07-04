import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: 'Username is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Email is not valid'),
        password: string({
            required_error: 'Password is required'
        }).min(8, 'Password must be at least 8 characters long'),
        passwordConfirmation: string({
            required_error: 'Password Confirmation is required'
        })
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation']
    })
})

const payload = {
    body: object({
        username: string({
            required_error: 'Username is required'
        }),
        email: string({
            required_error: 'Email is required'
        })
    })
}

const params = {
    params: object({
        userId: string({
            required_error: "userId is required",
        }),
    }),
}

export const updateUserSchema = object({
    ...payload,
    ...params,
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>
export type UpdateUserInput = TypeOf<typeof updateUserSchema>