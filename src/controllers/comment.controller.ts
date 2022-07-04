import { RequestHandler } from 'express'
import { CreateCommentInput, UpdateCommentInput } from '../schemas/comment.schema'
import { createComment, findAndUpdateComment, findComment, deleteComment } from '../services/comment.service'
import { findAndUpdatePost, findPost } from '../services/post.service'
import { updateUser } from '../services/user.service'
import log from '../utils/logger'

const createCommentHandler: RequestHandler<{}, {}, CreateCommentInput['body']> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        // @ts-ignore
        const postId = req.params.postId
        const body = req.body

        const post = await findPost({ postId })

        if (!post) return res.send({ message: 'Post not found' })

        if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

        const comment = await createComment({ ...body, user: userId, postId: postId })

        if (comment) {
            await findAndUpdatePost({ postId }, { $push: { comments: comment._id } }, { new: true })
            await updateUser({ userId }, { $push: { comments: comment._id } }, { new: true })
            return res.status(201).send(comment)
        }
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

const getCommentHandler: RequestHandler<UpdateCommentInput['params']> = async (req, res) => {
    try {
        const commentId = req.params.commentId

        const comment = await findComment({ commentId })

        if (!comment) return res.send({ message: 'Comment not found, check if correct the id is passed in params' })

        if (comment._id.toString() !== commentId) return res.send({ message: 'Comment not found, check if correct the id is passed in params' })

        res.send({ comment })
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

const updateCommentHandler: RequestHandler<UpdateCommentInput['params']> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        const commentId = req.params.commentId
        const update = req.body

        const comment = await findComment({ commentId })

        if (comment._id.toString() !== commentId) return res.send({ message: 'Comment not found, check if correct the id is passed in params' })

        if (String(comment.user) !== userId) return res.sendStatus(403)

        const updatedComment = await findAndUpdateComment({ commentId }, update, { new: true })

        return res.status(203).send({
            message: 'Comment updated successfully',
            updatedComment
        })
    } catch (error: any) {
        return {
            message: error.message
        }
    }

}

const deleteCommentHandler: RequestHandler<UpdateCommentInput['params']> = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
        const commentId = req.params.commentId

        const comment = await findComment({ commentId })

        if (comment._id.toString() !== commentId) return res.send({ message: 'Comment not found, check if correct the id is passed in params' })

        if (String(comment.user) !== userId) return res.sendStatus(403)

        await deleteComment({ commentId })

        return res.send({
            message: 'Comment deleted successfully'
        })
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

export const commentHandler = {
    createCommentHandler,
    getCommentHandler,
    updateCommentHandler,
    deleteCommentHandler
}
