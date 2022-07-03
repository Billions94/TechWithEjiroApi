import { object, string } from 'zod'

export const sessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }).email('Email is not valid'),
        password: string({
            required_error: 'Password is required'
        })
    })
})