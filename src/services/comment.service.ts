import { FilterQuery, UpdateQuery, QueryOptions, DocumentDefinition } from 'mongoose'
import Comment, { CommentDocument } from '../models/comments.model'



export const createComment = async (input: DocumentDefinition<Omit<CommentDocument, 'createdAt' | 'updatedAt' | 'image'>>) => {
    try {
        const result = await Comment.create(input)
        if (!result) throw new Error(`Error creating post: ${input}`)
        return result
    } catch (error) {
        throw error
    }
}

export const findComment = async (query: FilterQuery<CommentDocument>, options: QueryOptions = { lean: true }) => {
    try {
        const result = await Comment.findOne(query, {}, options)
        if (!result) throw new Error(`Error finding post`)
        return result
    } catch (error) {
        throw error
    }
}

export const findAndUpdateComment = async (query: FilterQuery<CommentDocument>, update: UpdateQuery<CommentDocument>, options: QueryOptions) => {
    return Comment.findOneAndUpdate(query, update, options)
}

export const deleteMany = async (query: FilterQuery<CommentDocument>) => {
    return Comment.deleteMany(query)
}

export const deleteComment = async (query: FilterQuery<CommentDocument>) => {
    return Comment.deleteOne(query)
}