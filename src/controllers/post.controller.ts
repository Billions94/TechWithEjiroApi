import { RequestHandler } from 'express'
import { CommentDocument } from '../models/comments.model'
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema'
import { deleteMany } from '../services/comment.service'
import { createPost, deletePost, findAndUpdatePost, findPost } from '../services/post.service'

const createPostHandler: RequestHandler<{}, {}, CreatePostInput["body"]> = async (req, res) => {
    const userId = res.locals.user._id
    const body = req.body

    const post = await createPost({ ...body, user: userId })

    return res.send(post)
}
const getPostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const postId = req.params.postId
    const post = await findPost({ postId })

    if (!post) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

    if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

    return res.send(post)

}
const updatePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const userId = res.locals.user._id
    const postId = req.params.postId
    const update = req.body

    const post = await findPost({ postId })

    if (!post) return res.sendStatus(404)

    if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

    if (String(post.user) !== userId) return res.sendStatus(403)

    const updatedProduct = await findAndUpdatePost({ postId }, update, {
        new: true,
    })

    return res.send(updatedProduct)
}
const deletePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const userId = res.locals.user._id
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
}

export const postHandler = {
    createPostHandler,
    getPostHandler,
    updatePostHandler,
    deletePostHandler
}