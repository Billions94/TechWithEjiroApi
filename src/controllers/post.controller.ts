import { RequestHandler } from 'express'
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema'
import { createPost, deletePost, findAndUpdatePost, findPost } from '../services/post.service'

export const createPostHandler: RequestHandler<{}, {}, CreatePostInput["body"]> = async (req, res) => {
    const userId = res.locals.user._id

    console.log({ userId })

    const body = req.body

    const post = await createPost({ ...body, user: userId })

    return res.send(post)
}
export const getPostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const postId = req.params.postId
    const post = await findPost({ postId })

    if (!post) {
        return res.sendStatus(404)
    }

    return res.send(post)
}
export const updatePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const userId = res.locals.user._id

    const postId = req.params.postId
    const update = req.body

    const post = await findPost({ postId })

    if (!post) {
        return res.sendStatus(404)
    }

    if (String(post.user) !== userId) {
        return res.sendStatus(403)
    }

    const updatedProduct = await findAndUpdatePost({ postId }, update, {
        new: true,
    })

    return res.send(updatedProduct)
}
export const deletePostHandler: RequestHandler<UpdatePostInput["params"]> = async (req, res) => {
    const userId = res.locals.user._id
    const postId = req.params.postId

    const post = await findPost({ postId })

    if (!post) {
        return res.sendStatus(404)
    }

    if (String(post.user) !== userId) {
        return res.sendStatus(403)
    }

    await deletePost({ postId })

    return res.sendStatus(200)
}