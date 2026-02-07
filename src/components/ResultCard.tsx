'use client'

import React, { useState } from 'react'
import { Section } from '@/types'

interface ResultCardProps {
  sections: Section[]
  fullText: string
  onReset: () => void
  onRetrySection: (sectionId: string) => void
}

export default function ResultCard({ sections, fullText, onReset, onRetrySection }: ResultCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [downloadingAll, setDownloadingAll] = useState(false)

  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (id) {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      } else {
        setCopiedAll(true)
        setTimeout(() => setCopiedAll(false), 2000)
      }
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      // 使用代理下载API
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('下载失败:', err)
    }
  }

  const downloadAllImages = async () => {
    setDownloadingAll(true)
    try {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        if (section.image_url) {
          await downloadImage(section.image_url, `小红书配图_${i + 1}.jpg`)
          // 添加延迟避免浏览器阻止多次下载
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
    } finally {
      setDownloadingAll(false)
    }
  }

  const passedSections = sections.filter(s => s.audit_status === 'pass')
  const allPassed = passedSections.length === sections.length

  return (
    <>
      <div className="bg-white rounded-3xl shadow-card p-8 animate-fade-in">
        {/* 卡片头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center text-white shadow-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">生成完成</h2>
              <p className="text-sm text-text-muted">共 {sections.length} 段内容，可直接发布小红书</p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新开始
          </button>
        </div>

        {/* 审核状态 */}
        <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${allPassed ? 'bg-green-50' : 'bg-yellow-50'}`}>
          {allPassed ? (
            <>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">审核全部通过</p>
                <p className="text-sm text-green-600">内容安全，可放心发布</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-yellow-800">部分内容需要修改</p>
                <p className="text-sm text-yellow-600">{sections.length - passedSections.length} 段内容未通过审核</p>
              </div>
            </>
          )}
        </div>

        {/* 分段内容列表 */}
        <div className="space-y-4 mb-8">
          {sections.map((section, index) => (
            <div
              key={section.section_id}
              className={`p-5 rounded-2xl border-2 transition-all duration-200 ${
                section.audit_status === 'pass'
                  ? 'border-gray-100 hover:border-primary-200'
                  : 'border-yellow-200 bg-yellow-50/50'
              }`}
            >
              <div className="flex gap-4">
                {/* 配图预览 */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-36 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden relative group">
                    {section.image_url ? (
                      <img
                        src={section.image_url}
                        alt={`段落${index + 1}配图`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* 操作按钮悬浮层 */}
                    {section.image_url && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        {/* 放大预览按钮 */}
                        <button
                          onClick={() => setPreviewImage(section.image_url!)}
                          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                          title="放大预览"
                        >
                          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </button>
                        {/* 下载按钮 */}
                        <button
                          onClick={() => downloadImage(section.image_url!, `小红书配图_${index + 1}.jpg`)}
                          className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                          title="下载图片"
                        >
                          <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 文案内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2 py-1 rounded-lg">
                      段落 {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {section.audit_status !== 'pass' && (
                        <button
                          onClick={() => onRetrySection(section.section_id)}
                          className="text-xs text-yellow-600 hover:text-yellow-700 flex items-center gap-1 cursor-pointer"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          重试
                        </button>
                      )}
                      <button
                        onClick={() => copyToClipboard(section.section_text, section.section_id)}
                        className="text-xs text-text-muted hover:text-primary-500 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedId === section.section_id ? (
                          <>
                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-500">已复制</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            复制
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {section.section_text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部操作区 */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={() => copyToClipboard(fullText)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            {copiedAll ? (
              <>
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                已复制全文
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                一键复制全文
              </>
            )}
          </button>

          <button
            onClick={downloadAllImages}
            disabled={downloadingAll}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {downloadingAll ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                下载中...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载全部图片
              </>
            )}
          </button>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] m-4">
            {/* 关闭按钮 */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 cursor-pointer transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 图片 */}
            <img
              src={previewImage}
              alt="预览大图"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* 下载按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                const index = sections.findIndex(s => s.image_url === previewImage)
                downloadImage(previewImage, `小红书配图_${index + 1}.jpg`)
              }}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-white text-primary-500 font-medium flex items-center gap-2 hover:bg-primary-50 cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载图片
            </button>
          </div>
        </div>
      )}
    </>
  )
}
