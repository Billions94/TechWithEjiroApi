import { Express } from 'express'
import { createCommentHandler, deleteCommentHandler, getCommentHandler, updateCommentHandler } from './controllers/comment.controller'
import { createPostHandler, deletePostHandler, updatePostHandler, getPostHandler } from './controllers/post.controller'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controllers/session.controller'
import { createUserHandler, getUserHandler } from './controllers/user.controller'
import requireUser from './middleware/requireUser'
import validateResources from './middleware/validateResources'
import { createPostSchema, updatePostSchema, getPostSchema, deletePostSchema } from './schemas/post.schema'
import { createCommentSchema, updateCommentSchema, getCommentSchema, deleteCommentSchema } from './schemas/comment.schema'
import { sessionSchema } from './schemas/session.schema'
import { createUserSchema } from './schemas/user.schema'

export default function Routes(app: Express) {

    // User Routes
    app.post('/api/users', validateResources(createUserSchema), createUserHandler)

    app.get('/api/users', getUserHandler)

    // Session Routes
    app.route('/api/sessions')
        .post(validateResources(sessionSchema), createUserSessionHandler)
        .get(requireUser, getUserSessionsHandler)
        .delete(requireUser, deleteSessionHandler)


    // Posts Routes
    app.post(
        "/api/posts",
        [requireUser, validateResources(createPostSchema)],
        createPostHandler
    )

    app.route("/api/posts/:postId")
        .get(validateResources(getPostSchema), getPostHandler)
        .put([requireUser, validateResources(updatePostSchema)], updatePostHandler)
        .delete([requireUser, validateResources(deletePostSchema)], deletePostHandler)

    // Comments Routes
    app.post("/api/comments/:postId", requireUser, createCommentHandler)

    app.route("api/comments/:commentId")
        .get(validateResources(getCommentSchema), getCommentHandler)
        .put([requireUser, validateResources(updateCommentSchema)], updateCommentHandler)
        .delete([requireUser, validateResources(deleteCommentSchema)], deleteCommentHandler)

}