import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小红书文生图 - AI一键生成小红书图文',
  description: '把长文章一键转成小红书可发布的分段文案与每段配图，轻松创作爆款内容',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans text-text-primary antialiased min-h-screen selection:bg-primary-100 selection:text-primary-600">
        {children}
      </body>
    </html>
  )
}
