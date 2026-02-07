'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Copy, Download, RefreshCw, X, ChevronRight, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react'
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
      console.error('Copy failed:', err)
    }
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const downloadAllImages = async () => {
    setDownloadingAll(true)
    try {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        if (section.image_url) {
          await downloadImage(section.image_url, `小红书配图_${i + 1}.jpg`)
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">生成完成</h2>
              <p className="text-text-muted">共 {sections.length} 段内容，可直接发布小红书</p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:bg-white/50 hover:text-text-primary transition-all duration-200 text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            重新开始
          </button>
        </div>

        {/* Audit Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${allPassed ? 'bg-green-50/50 border-green-100' : 'bg-amber-50/50 border-amber-100'}`}
        >
          {allPassed ? (
            <>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-sm">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800 text-sm">审核全部通过</p>
                <p className="text-xs text-green-700/80">内容安全，内容优质，可放心发布</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-amber-800 text-sm">部分内容建议优化</p>
                <p className="text-xs text-amber-700/80">{sections.length - passedSections.length} 段内容未完全通过审核</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-6 mb-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.section_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`
                group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg
                ${section.audit_status === 'pass'
                  ? 'bg-white/40 border-white/60 hover:border-white hover:bg-white/60'
                  : 'bg-amber-50/30 border-amber-100 hover:border-amber-200'
                }
              `}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Preview */}
                <div className="shrink-0 flex justify-center md:justify-start">
                  <div className="w-32 h-40 md:w-36 md:h-48 rounded-xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-300">
                    {section.image_url ? (
                      <>
                        <img
                          src={section.image_url}
                          alt={`段落${index + 1}配图`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button
                            onClick={() => setPreviewImage(section.image_url!)}
                            className="p-2 rounded-full bg-white/90 text-text-primary hover:bg-white hover:scale-110 transition-all shadow-lg"
                            title="预览"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadImage(section.image_url!, `小红书配图_${index + 1}.jpg`)}
                            className="p-2 rounded-full bg-white/90 text-text-primary hover:bg-white hover:scale-110 transition-all shadow-lg"
                            title="下载"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-primary-50 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-primary-200" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-primary-50 text-primary-600">
                      段落 {index + 1}
                    </span>

                    <div className="flex items-center gap-2">
                      {section.audit_status !== 'pass' && (
                        <button
                          onClick={() => onRetrySection(section.section_id)}
                          className="flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 px-2 py-1 rounded-lg hover:bg-amber-50 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                          重试
                        </button>
                      )}

                      <button
                        onClick={() => copyToClipboard(section.section_text, section.section_id)}
                        className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary-600 px-2 py-1 rounded-lg hover:bg-primary-50 transition-all"
                      >
                        {copiedId === section.section_id ? (
                          <>
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            复制
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <p className="text-sm text-text-primary leading-7 whitespace-pre-wrap font-medium">
                      {section.section_text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/60">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => copyToClipboard(fullText)}
            className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2"
          >
            {copiedAll ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-bold">已复制全文</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                一键复制全文
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadAllImages}
            disabled={downloadingAll}
            className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30"
          >
            {downloadingAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                下载中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                下载全部图片
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={previewImage}
                alt="预览大图"
                className="max-h-[85vh] max-w-full rounded-lg shadow-2xl object-contain"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation()
                  const index = sections.findIndex(s => s.image_url === previewImage)
                  downloadImage(previewImage, `小红书配图_${index + 1}.jpg`)
                }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-full bg-white text-primary-600 font-bold shadow-xl flex items-center gap-2 hover:bg-primary-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                下载原图
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
