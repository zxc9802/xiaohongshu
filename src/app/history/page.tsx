'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft, Image, FileText, Trash2, Eye } from 'lucide-react'

interface HistoryItem {
    id: string
    rawText: string
    resultJson: string
    createdAt: string
}

export default function HistoryPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [histories, setHistories] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                const response = await fetch('/api/history')
                if (response.ok) {
                    const data = await response.json()
                    setHistories(data.histories || [])
                }
            } catch (error) {
                console.error('获取历史记录失败:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session) {
            fetchHistories()
        }
    }, [session])

    if (status === 'loading' || loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
            </main>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const parseResult = (resultJson: string) => {
        try {
            return JSON.parse(resultJson)
        } catch {
            return []
        }
    }

    return (
        <main className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-500 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回首页
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary-500" />
                        历史记录
                    </h1>
                    <div className="w-20" /> {/* Spacer for alignment */}
                </div>

                {/* History List */}
                {histories.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-3xl p-12 text-center"
                    >
                        <Clock className="w-16 h-16 mx-auto text-text-muted/50 mb-4" />
                        <h2 className="text-xl font-semibold text-text-primary mb-2">暂无历史记录</h2>
                        <p className="text-text-muted mb-6">开始创作，你的作品将自动保存在这里</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                        >
                            开始创作
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-4">
                        {histories.map((item, index) => {
                            const sections = parseResult(item.resultJson)
                            const imageCount = sections.filter((s: any) => s.image_url).length

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="glass-card rounded-2xl p-6 hover:shadow-3d-hover transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-text-primary line-clamp-2 mb-3">
                                                {item.rawText.slice(0, 150)}
                                                {item.rawText.length > 150 && '...'}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(item.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    {sections.length} 段
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Image className="w-4 h-4" />
                                                    {imageCount} 图
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedItem(item)}
                                            className="flex-shrink-0 p-3 rounded-xl bg-primary-50 text-primary-500 hover:bg-primary-100 transition-colors"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Detail Modal */}
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-text-primary">详情预览</h3>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="text-text-muted hover:text-text-primary"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium text-text-secondary mb-2">原文</h4>
                                    <div className="text-text-primary bg-gray-50 rounded-xl p-4 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                                        {selectedItem.rawText}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-text-secondary mb-2">生成结果</h4>
                                    <div className="space-y-3">
                                        {parseResult(selectedItem.resultJson).map((section: any, idx: number) => (
                                            <div key={idx} className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-sm text-text-primary mb-2">{section.section_text}</p>
                                                {section.image_url && (
                                                    <img
                                                        src={section.image_url}
                                                        alt={`Section ${idx + 1}`}
                                                        className="w-full max-w-xs rounded-lg"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </main>
    )
}
