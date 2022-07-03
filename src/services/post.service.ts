import { FilterQuery, UpdateQuery, QueryOptions, DocumentDefinition } from 'mongoose'
import Post, { PostDocument } from '../models/post.model'


export const createPost = async (input: DocumentDefinition<Omit<PostDocument, 'createdAt' | 'updatedAt' | 'image'>>) => {
    try {
        const result = await Post.create(input)
        if(!result) throw new Error(`Error creating post: ${input}`)
        return result
    } catch (error) {
        throw error
    }
}

export const findPost = async (query: FilterQuery<PostDocument>, options: QueryOptions = { lean: true }) => {
try {
    const result = await Post.findOne(query, {}, options)
    if (!result) throw new Error(`Error finding post`)
    return result
} catch (error) {
    throw error
}
}
export const findAndUpdatePost = async (query: FilterQuery<PostDocument>, update: UpdateQuery<PostDocument>, options: QueryOptions) => {
    return Post.findOneAndUpdate(query, update, options)
}

export const deletePost = async (query: FilterQuery<PostDocument>) => {
    return Post.deleteOne(query)
}