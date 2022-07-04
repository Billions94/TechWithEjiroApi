import { RequestHandler } from 'express'
import { CreateUserInput } from '../schemas/user.schema'
import { createUser, getUsers } from '../services/user.service'
import logger from '../utils/logger'

const createUserHandler: RequestHandler<{}, {}, CreateUserInput['body']> = async (req, res) => {
    try {
        const user = await createUser(req.body) // call create user service
        return res.status(201).send({
            message: 'User created successfully',
            user: user
        })
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send({
            message: `Error creating user: ${error.message}`,
        })
    }
}

const getUserHandler: RequestHandler = async (req, res) => {
    try {
        const users = await getUsers()
        return res.status(200).send({
            users,
        })
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send({
            message: `Error creating user: ${error.message}`,
        })
    }
}

export const userHandler = {
    createUserHandler,
    getUserHandler,
}