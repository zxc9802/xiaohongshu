'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { LogIn, LogOut, User, Clock, Sparkles } from 'lucide-react'

export default function Header() {
    const { data: session, status } = useSession()

    return (
        <header className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-button group-hover:shadow-glow transition-shadow">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text">小红书文生图</h1>
                        <p className="text-sm text-text-muted">3步完成小红书图文发布</p>
                    </div>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {status === 'loading' ? (
                        <div className="w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                    ) : session ? (
                        <>
                            <Link
                                href="/history"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border border-white/60 text-text-secondary hover:text-primary-500 hover:border-primary-200 transition-all"
                            >
                                <Clock className="w-4 h-4" />
                                <span className="hidden sm:inline">历史记录</span>
                            </Link>

                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-600">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline max-w-[100px] truncate">
                                    {session.user?.name || session.user?.email?.split('@')[0]}
                                </span>
                            </div>

                            <motion.button
                                onClick={() => signOut()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2.5 rounded-xl bg-white/80 border border-white/60 text-text-muted hover:text-red-500 hover:border-red-200 transition-all"
                                title="退出登录"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border border-white/60 text-text-secondary hover:text-primary-500 hover:border-primary-200 transition-all"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">登录</span>
                            </Link>

                            <Link
                                href="/register"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-button hover:shadow-glow transition-all"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span className="hidden sm:inline">注册</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
