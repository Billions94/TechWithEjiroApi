
import { Document, Model } from 'mongoose'

export interface UserDocument extends Document {
    name: string
    username: string
    email: string
    password: string
    image: string
    isAdmin: boolean
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

export interface SessionDocument extends Document {
    user: UserDocument['_id']
    valid: boolean
    userAgent: string
    createdAt: Date
    updatedAt: Date
}

export interface PostDocument extends Document {
    user: UserDocument['_id']
    title: string
    content: string
    image: string
    createdAt: Date
    updatedAt: Date
}