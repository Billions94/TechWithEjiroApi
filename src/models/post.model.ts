import mongoose from "mongoose"
import { PostDocument } from "./interfaces"

const { Schema, model } = mongoose


const PostSchema = new Schema<PostDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: [500, 'Content length must not be more than 500']
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

PostSchema.methods.toJSON = function () {
    const postDoc = this
    const postObject = postDoc.toObject()

    delete postObject.__v

    return postObject
}


const Post = model<PostDocument>('Post', PostSchema)

export default Post