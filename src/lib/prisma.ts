import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// 延迟初始化，避免在构建时连接数据库
const getPrismaClient = () => {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = new PrismaClient()
    }
    return globalForPrisma.prisma
}

export const prisma = getPrismaClient()
