import { RequestHandler } from 'express'
import { CommentDocument } from '../models/comments.model'
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema'
import { deleteMany } from '../services/comment.service'
import { createPost, deletePost, findAndUpdatePost, findPost } from '../services/post.service'
import { updateUser } from '../services/user.service'

const createPostHandler: RequestHandler<{}, {}, CreatePostInput["body"]> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        const body = req.body

        const post = await createPost({ ...body, user: userId })

        if (post) {
            await updateUser({ userId }, { $push: { posts: post._id } }, { new: true })
            return res.status(201).send(post)
        }
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}
const getPostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    try {
        const postId = req.params.postId
        const post = await findPost({ postId })

        if (!post) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

        if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

        return res.send(post)
    } catch (error: any) {
        return {
            message: error.message
        }
    }

}
const updatePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        const postId = req.params.postId
        const update = req.body

        const post = await findPost({ postId })

        if (!post) return res.sendStatus(404)

        if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

        if (String(post.user) !== userId) return res.sendStatus(403)

        const updatedProduct = await findAndUpdatePost({ postId }, update, {
            new: true,
        })

        return res.status(203).send(updatedProduct)
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}
const deletePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        const postId = req.params.postId

        const post = await findPost({ postId })

        if (!post) return res.sendStatus(404)

        if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

        if (String(post.user) !== userId) return res.sendStatus(403)

        const allComments = post.comments.find((comment: CommentDocument) => comment.postId === postId) as string

        await deleteMany({ allComments })

        await deletePost({ postId })

        return res.send({
            message: 'Post deleted successfully'
        })
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

export const postHandler = {
    createPostHandler,
    getPostHandler,
    updatePostHandler,
    deletePostHandler
}