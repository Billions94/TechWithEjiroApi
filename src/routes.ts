import { Express } from 'express'
import { commentHandler } from './controllers/comment.controller'
import { postHandler } from './controllers/post.controller'
import { sessionHandler } from './controllers/session.controller'
import { userHandler } from './controllers/user.controller'
import requireUser from './middleware/requireUser'
import validateResources from './middleware/validateResources'
import { createPostSchema, updatePostSchema, getPostSchema, deletePostSchema } from './schemas/post.schema'
import { sessionSchema } from './schemas/session.schema'
import { createUserSchema } from './schemas/user.schema'
import { createCommentSchema, deleteCommentSchema, getCommentSchema, updateCommentSchema } from './schemas/comment.schema'

export default function Routes(app: Express) {

    // User Routes
    app.route('/api/users')
        .post(validateResources(createUserSchema), userHandler.createUserHandler)
        .get(userHandler.getUserHandler)

    app.route('/api/users/:userId')
        .get(userHandler.findUserHandler)

    // Session Routes
    app.route('/api/sessions')
        .post(validateResources(sessionSchema), sessionHandler.createUserSessionHandler)
        .get(requireUser, sessionHandler.getUserSessionsHandler)
        .delete(requireUser, sessionHandler.deleteSessionHandler)


    // Posts Routes
    app.post(
        "/api/posts",
        [requireUser, validateResources(createPostSchema)],
        postHandler.createPostHandler
    )

    app.route("/api/posts/:postId")
        .get(validateResources(getPostSchema), postHandler.getPostHandler)
        .put([requireUser, validateResources(updatePostSchema)], postHandler.updatePostHandler)
        .delete([requireUser, validateResources(deletePostSchema)], postHandler.deletePostHandler)

    // Comments Routes
    app.post("/api/comments/:postId", [requireUser, validateResources(createCommentSchema)], commentHandler.createCommentHandler)

    app.route("/api/comments/:commentId")
        .get(validateResources(getCommentSchema), commentHandler.getCommentHandler)
        .put([requireUser, validateResources(updateCommentSchema)], commentHandler.updateCommentHandler)
        .delete([requireUser, validateResources(deleteCommentSchema)], commentHandler.deleteCommentHandler)

}