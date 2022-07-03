import mongoose, { Document } from 'mongoose'
import { UserDocument } from './user.model'


export interface CommentDocument extends Document {
    user: UserDocument['_id']
    content: string
    image: string
    createdAt: Date
    updatedAt: Date
}

const { Schema, model } = mongoose

const CommentSchema = new Schema<CommentDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true,
            maxlength: [255, 'Content should not exceed 255 characters']
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

CommentSchema.methods.toJSON = function () {
    const commentDoc = this as CommentDocument
    const commentObject = commentDoc.toObject()

    delete commentObject.__v

    return commentObject
}

const Comment = model<CommentDocument>('Comment', CommentSchema)

export default Comment