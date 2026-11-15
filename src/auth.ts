import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'

const adapter = new PrismaMariaDb({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'admin_panel',
})

const prisma = new PrismaClient({ adapter })

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                })

                if (!user || user.password !== credentials.password) {
                    return null
                }

                if (user.role !== 'ADMIN') {
                    return null
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = (user as any).role
            return token
        },
        session({ session, token }) {
            (session.user as any).role = token.role
            return session
        },
    },
})