import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: 获取当前用户的历史记录
export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: '请先登录' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                histories: {
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: '用户不存在' }, { status: 404 })
        }

        return NextResponse.json({ histories: user.histories })
    } catch (error) {
        console.error('获取历史记录失败:', error)
        return NextResponse.json({ error: '获取历史记录失败' }, { status: 500 })
    }
}

// POST: 保存新的历史记录
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: '请先登录' }, { status: 401 })
        }

        const { rawText, resultJson } = await request.json()

        if (!rawText || !resultJson) {
            return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: '用户不存在' }, { status: 404 })
        }

        const history = await prisma.history.create({
            data: {
                userId: user.id,
                rawText,
                resultJson: typeof resultJson === 'string' ? resultJson : JSON.stringify(resultJson)
            }
        })

        return NextResponse.json({ success: true, history })
    } catch (error) {
        console.error('保存历史记录失败:', error)
        return NextResponse.json({ error: '保存历史记录失败' }, { status: 500 })
    }
}
