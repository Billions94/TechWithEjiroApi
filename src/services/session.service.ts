import { get } from 'lodash'
import config from 'config'
import { FilterQuery, UpdateQuery } from 'mongoose'
import Session, { SessionDocument } from '../models/session.model'
import { verifyJwt, signJwt } from '../utils/jwt.utils'
import { findUser } from './user.service'


export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent })

  return session.toJSON()
}

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean()
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) =>  {
  return Session.updateOne(query, update)
}

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string }) => {
  const { decoded } = verifyJwt(refreshToken, "refreshTokenPublicKey")

  if (!decoded || !get(decoded, "session")) return false

  const session = await Session.findById(get(decoded, "session"))

  if (!session || !session.valid) return false

  const user = await findUser({ _id: session.user })

  if (!user) return false

  const accessToken = signJwt(
    { ...user, session: session._id },
    "accessTokenPrivateKey",
    { expiresIn: config.get("accessTokenTtl") } // 15 minutes
  )

  return accessToken
}
