import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production'

export async function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword)
}

export async function createSession(adminId) {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, adminId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })
}

export async function getSession() {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!sessionId) return null

    const admin = await prisma.admin.findUnique({
        where: { id: sessionId },
    })

    return admin
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
}

