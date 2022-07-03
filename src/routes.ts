import { Express, RequestHandler } from 'express'
import { createPostHandler, deletePostHandler, updatePostHandler, getPostHandler } from './controllers/post.controller'
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from './controllers/session.controller'
import { createUserHandler, getUserHandler } from './controllers/user.controller'
import requireUser from './middleware/requireUser'
import validateResources from './middleware/validateResources'
import { createPostSchema, updatePostSchema, getPostSchema, deletePostSchema } from './schemas/post.schema'
import { sessionSchema } from './schemas/session.schema'
import { createUserSchema } from './schemas/user.schema'

export default function Routes(app: Express) {

    // User Routes
    app.post('/api/users', validateResources(createUserSchema), createUserHandler)

    app.get('/api/users', getUserHandler)

    // Session Routes
    app.post('/api/sessions', validateResources(sessionSchema), createUserSessionHandler)

    app.get('/api/sessions', requireUser, getUserSessionsHandler)

    app.delete('/api/sessions', requireUser, deleteSessionHandler)

    // Posts Routes
    app.post(
        "/api/posts",
        [requireUser, validateResources(createPostSchema)],
        createPostHandler
    )

    app.put(
        "/api/posts/:postId",
        [requireUser, validateResources(updatePostSchema)],
        updatePostHandler
    )

    app.get(
        "/api/posts/:postId",
        validateResources(getPostSchema),
        getPostHandler
    )

    app.delete(
        "/api/posts/:postId",
        [requireUser, validateResources(deletePostSchema)],
        deletePostHandler
    )

}