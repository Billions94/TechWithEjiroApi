import mongoose from "mongoose"
import { SessionDocument } from "./interfaces"

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
    const sessionDoc = this
    const sessionObject = sessionDoc.toObject()

    delete sessionObject.__v

    return sessionObject
}


const Session = model<SessionDocument>('Session', SessionSchema)

export default Session