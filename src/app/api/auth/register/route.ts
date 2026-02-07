import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: '密码至少需要6个字符' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: '该邮箱已被注册' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { name: name || email.split('@')[0], email, password: hashedPassword }
        })

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        })
    } catch (error) {
        console.error('注册失败:', error)
        return NextResponse.json({ error: '注册失败，请稍后再试' }, { status: 500 })
    }
}
