import { RequestHandler } from 'express'
import { CommentDocument } from '../models/comments.model'
import { PostDocument } from '../models/post.model'
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schema'
import { deleteMany } from '../services/comment.service'
import { deleteManyPosts } from '../services/post.service'
import { updateSession } from '../services/session.service'
import { createUser, deleteUser, findUser, getUsers } from '../services/user.service'
import log from '../utils/logger'
import logger from '../utils/logger'

const createUserHandler: RequestHandler<{}, {}, CreateUserInput['body']> = async (req, res) => {
    try {
        // @ts-ignore
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

const deleteUserHandler: RequestHandler<UpdateUserInput['params']> = async (req, res) => {
    try {
        const userId = req.params.userId

        // const sessionId = res.locals.user.session

        const user = await findUser({ userId })

        const allPosts = user?.posts.find((post: PostDocument) => post.user === userId)
        
       const allComments = user?.comments.find((comment: CommentDocument) => comment.user === userId)
        // const allComments = allPost.comments.toString()


        await deleteMany({ allComments })

        await deleteManyPosts({ allPosts })

        // await updateSession({ _id: sessionId }, { valid: false })

        await deleteUser({ userId })


        return res.send({
            message: 'User deleted successfully'
        })

    } catch (error: any) {
        logger.error(error)
        return res.status(409).send({
            message: `Error finding user: ${error.message}`,
        })
    }
}


export const userHandler = {
    createUserHandler,
    getUserHandler,
    findUserHandler,
    deleteUserHandler,
}