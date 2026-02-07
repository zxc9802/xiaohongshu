import NextAuth, { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: "邮箱密码",
            credentials: {
                email: { label: "邮箱", type: "email" },
                password: { label: "密码", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("请输入邮箱和密码")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    throw new Error("用户不存在或密码错误")
                }

                const isValid = await bcrypt.compare(credentials.password, user.password)
                if (!isValid) {
                    throw new Error("密码错误")
                }

                return { id: user.id, name: user.name, email: user.email, image: user.image }
            }
        })
    ],
    session: { strategy: "jwt" },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
