import mongoose from "mongoose"
import { UserDocument, UserModel } from "./interfaces"
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose


const UserSchema = new Schema<UserDocument>(
    {
        name: {
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
        isAdmin: {
            type: Boolean,
            default: false,
            enum: ['true', 'false']
        },
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
    const userDoc = this
    const userObject = userDoc.toObject()
    
    delete userObject.password
    delete userObject.__v
    delete userObject.refreshToken

    return userObject
}


const User = model<UserDocument, UserModel>('User', UserSchema)

export default User