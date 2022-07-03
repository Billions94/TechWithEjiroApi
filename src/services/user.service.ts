import { DocumentDefinition, FilterQuery } from 'mongoose'
import User, { UserDocument } from '../models/user.model';
import bcrypt from 'bcrypt'

export const createUser = async (input: DocumentDefinition<Omit<UserDocument,'name' | 'createdAt' | 'updatedAt' | 'refreshToken' | 'isAdmin' | 'image'>>) => {
    try {
        return await User.create(input)
    } catch (error: any) {
        throw new Error(error);
    }
}

export const validateCredentials = async function (email: string, plainPassword: string) {
    const user = await User.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(plainPassword, user.password)
        if (isMatch) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export const getUsers = async () => {
    try {
        return await User.find({})
    } catch (error: any) {
        throw new Error(error.message);
    }
}

export const findUser = async (query: FilterQuery<UserDocument>) => {
    try {
        return await User.findOne(query).lean()
    } catch (error: any) {
        throw new Error(error.message);
    }
}