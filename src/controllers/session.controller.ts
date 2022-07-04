
import { RequestHandler } from 'express'
import { createSession, findSessions, updateSession } from '../services/session.service'
import { validateCredentials } from '../services/user.service'
import { signJwt } from '../utils/jwt.utils'
import dotenv from "dotenv";
dotenv.config();
import config from "config"


const createUserSessionHandler: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body
    
        const user = await validateCredentials(email, password)
        if (!user) {
            return res.status(401).send("Invalid email or password")
        }
        // create a session
        const session = await createSession(user._id, req.get("user-agent") || "")
        // create an access token
        const accessToken = signJwt(
            { ...user, session: session._id },
            "accessTokenPrivateKey",
            { expiresIn: config.get("accessTokenTtl") } // 15 minutes,
        )
        // create a refresh token
        const refreshToken = signJwt(
            { ...user, session: session._id },
            "refreshTokenPrivateKey",
            { expiresIn: config.get("refreshTokenTtl") } // 15 minutes
        )
        // return access & refresh tokens
        return res.status(201).send({ accessToken, refreshToken })
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

const getUserSessionsHandler: RequestHandler = async (req, res) => {
    try {
        const userId = res.locals.user._doc._id
    
        const sessions = await findSessions({ user: userId, valid: true })
    
        return res.send(sessions)
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

const deleteSessionHandler: RequestHandler = async (req, res) => {
    try {
        const sessionId = res.locals.user.session
    
        await updateSession({ _id: sessionId }, { valid: false })
    
        return res.send({
            accessToken: null,
            refreshToken: null,
        })
    } catch (error: any) {
        return {
            message: error.message
        }
    }
}

export const sessionHandler = {
    createUserSessionHandler,
    getUserSessionsHandler,
    deleteSessionHandler
}