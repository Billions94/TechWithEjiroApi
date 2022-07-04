import { RequestHandler } from 'express'
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schema'
import { createUser, deleteUser, findUser, getUsers } from '../services/user.service'
import logger from '../utils/logger'

const createUserHandler: RequestHandler = async (req, res) => {
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

const findUserHandler: RequestHandler<UpdateUserInput["params"]> = async (req, res) => {
    try {
        const userId = req.params.userId

        const user = await findUser({ userId })

        if (user?._id.toString() !== userId) return res.send({ message: 'User not found' })

        return res.send({ user })
    } catch (error: any) {
        logger.error(error)
        return res.status(409).send({
            message: `Error finding user: ${error.message}`,
        })
    }
}

// const deleteUserHandler: RequestHandler<UpdateUserInput['params']> = async (req, res) => {
//     try {
//         const userId = req.params.userId

//         const user = await findUser({ userId })

//         const allPost = user.posts.find((post: PostDocument) => )

//         await deleteUser({ userId })

//     } catch (error: any) {
//         logger.error(error)
//         return res.status(409).send({
//             message: `Error finding user: ${error.message}`,
//         })
//     }
// }


export const userHandler = {
    createUserHandler,
    getUserHandler,
    findUserHandler
}