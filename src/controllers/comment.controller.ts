import { RequestHandler } from 'express'
import { CreateCommentInput, UpdateCommentInput } from '../schemas/comment.schema'
import { createComment, deleteComment, findAndUpdateComment, findComment } from '../services/comment.service'
import { findAndUpdatePost, findPost } from '../services/post.service'

const createCommentHandler: RequestHandler<{}, {}, CreateCommentInput['body']> = async (req, res) => {
    const userId = res.locals.user._id
    // @ts-ignore
    const postId = req.params.postId

    const body = req.body

    const post = await findPost({ postId })

    if (!post) return res.send({ message: 'Post not found' })

    if (post._id.toString() !== postId) return res.send({ message: 'Post not found, check if correct the id is passed in params' })

    const comment = await createComment({ ...body, user: userId, postId: postId })

    if (comment) {
        await findAndUpdatePost({ postId }, { $push: { comments: comment._id } }, { new: true })
        return res.send(comment)
    }
}
const getCommentHandler: RequestHandler<UpdateCommentInput["params"]> = async (req, res) => {

    const commentId = req.params.commentId
    console.log({ commentId })
    const comment = await findComment({ commentId })

    console.log({ comment })


    if (!comment) return res.sendStatus(404)

    return res.send(comment)
}

export const commentHandler = {
    createCommentHandler,
    getCommentHandler
}
// export const updateCommentHandler: RequestHandler<UpdateCommentInput["params"]> = async (req, res) => {
//     const userId = res.locals.user._id

//     const commentId = req.params.commentId
//     const update = req.body

//     const comment = await findComment({ commentId })

//     if (!comment) return res.sendStatus(404)

//     if (String(comment.user) !== userId) return res.sendStatus(403)

//     const updatedProduct = await findAndUpdateComment({ commentId }, update, {
//         new: true,
//     })

//     return res.send(updatedProduct)
// }
// export const deleteCommentHandler: RequestHandler<UpdateCommentInput["params"]> = async (req, res) => {
//     const userId = res.locals.user._id
//     const commentId = req.params.commentId

//     const comment = await findComment({ commentId })

//     if (!comment) return res.sendStatus(404)

//     if (String(comment.user) !== userId) return res.sendStatus(403)

//     await deleteComment({ commentId })

//     return res.send({
//         message: 'Comment deleted successfully'
//     })
// }