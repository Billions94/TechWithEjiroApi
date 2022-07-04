import mongoose, { Document, Model } from "mongoose"
import bcrypt from 'bcrypt'
import { PostDocument } from "./post.model"
import { CommentDocument } from "./comments.model"

const { Schema, model } = mongoose


export interface UserDocument extends Document {
    firstName: string
    lastName: string
    username: string
    email: string
    password: string
    image: string
    posts: PostDocument['_id']
    comments: CommentDocument['_id']
    replies: mongoose.Types.ObjectId
    refreshToken: string
    createdAt: Date
    updatedAt: Date
    _doc?: {
        _id: string
    }
    session?: string
}

export interface UserModel extends Model<UserDocument> {
    verifyCredentials(email: string, password: string): Promise<UserDocument & Document | null>;
}


const UserSchema = new Schema<UserDocument>(
    {
        firstName: {
            type: String,
            required: false,
            maxlength: [30, 'Name must be lesst 30 characters']
        },
        lastName: {
            type: String,
            required: false,
            maxlength: [30, 'Name must be lesst 30 characters']
        },
        username: {
            type: String,
            unique: true,
            required: [true, 'Username is required'],
            maxlength: [30, 'Name must be lesst 30 characters']
        },
        email: {
            unique: true,
            type: String,
            required: [true, 'Email is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        image: {
            type: String,
        },
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        replies: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', async function (next) {
    const newUser = this

    const plainPassword = newUser.password

    if (newUser.isModified('password')) {
        const hash = await bcrypt.hash(plainPassword, 10)
        newUser.password = hash
    }
    next()
})

UserSchema.methods.toJSON = function () {
    const userDoc = this as UserDocument
    const userObject = userDoc.toObject()

    delete userObject.password
    delete userObject.__v
    delete userObject.refreshToken

    return userObject
}


const User = model<UserDocument, UserModel>('User', UserSchema)

export default User