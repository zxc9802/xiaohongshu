'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus, Sparkles, ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('两次输入的密码不一致')
            return
        }

        if (password.length < 6) {
            setError('密码至少需要6个字符')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || '注册失败')
                return
            }

            // 注册成功，跳转到登录页
            router.push('/login?registered=true')
        } catch (err) {
            setError('注册失败，请稍后再试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-500 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    返回首页
                </Link>

                <div className="glass-card rounded-3xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-glow">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary">创建账号</h1>
                        <p className="text-text-muted mt-2">加入我们，开始你的创作之旅</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">昵称 (可选)</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="你的昵称"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/60 border border-white/60 
                           focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                           transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">邮箱</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/60 border border-white/60 
                           focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                           transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">密码</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="至少6个字符"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/60 border border-white/60 
                           focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                           transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">确认密码</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="再次输入密码"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/60 border border-white/60 
                           focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
                           transition-all duration-300 outline-none"
                                />
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 
                       text-white font-semibold shadow-button hover:shadow-glow
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    注册
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center mt-6 text-text-muted">
                        已有账号？{' '}
                        <Link href="/login" className="text-primary-500 hover:text-primary-600 font-medium">
                            立即登录
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    )
}
