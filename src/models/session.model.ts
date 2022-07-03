import mongoose, { Document } from 'mongoose'
import { UserDocument } from "./user.model"


export interface SessionDocument extends Document {
    user: UserDocument['_id']
    valid: boolean
    userAgent: string
    createdAt: Date
    updatedAt: Date
}

const { Schema, model } = mongoose

const SessionSchema = new Schema<SessionDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        valid: {
            type: Boolean,
            default: true
        },
        userAgent: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

SessionSchema.methods.toJSON = function () {
    const sessionDoc = this as SessionDocument
    const sessionObject = sessionDoc.toObject()

    delete sessionObject.__v

    return sessionObject
}


const Session = model<SessionDocument>('Session', SessionSchema)

export default Session