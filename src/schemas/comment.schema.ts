import { object, string, TypeOf } from 'zod'

const payload = {
    body: object({
        content: string({
            required_error: 'Content is required'
        }),
        image: string()
    })
}

const params = {
    params: object({
        commentId: string({
            required_error: "commentId is required",
        }),
    }),
}

export const createCommentSchema = object({
    ...payload,
})

export const updateCommentSchema = object({
    ...payload,
    ...params,
})

export const getCommentSchema = object({
    ...params,
})

export const deleteCommentSchema = object({
    ...params,
})

export type CreateCommentInput = TypeOf<typeof createCommentSchema>
export type ReadCommentInput = TypeOf<typeof getCommentSchema>
export type UpdateCommentInput = TypeOf<typeof updateCommentSchema>
export type DeleteCommentInput = TypeOf<typeof deleteCommentSchema>