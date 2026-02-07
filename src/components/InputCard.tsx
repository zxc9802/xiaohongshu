'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, ArrowRight, Sparkles } from 'lucide-react'

interface InputCardProps {
  onNext: (text: string) => void
  initialText?: string
}

export default function InputCard({ onNext, initialText = '' }: InputCardProps) {
  const [text, setText] = useState(initialText)
  const [isFocused, setIsFocused] = useState(false)

  const charCount = text.length
  const minChars = 50

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleSubmit = () => {
    if (charCount < minChars) return
    onNext(text)
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch (err) {
      console.error('Failed to paste:', err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
    >
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 shrink-0">
          <Sparkles className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">粘贴你的长文章</h2>
          <p className="text-text-secondary">AI将自动识别段落，为你改写成爆款小红书文案</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative group">
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r from-primary-300 to-secondary-300 rounded-2xl opacity-0 transition duration-300 ${isFocused ? 'opacity-50 blur' : ''}`}
        />
        <div className="relative">
          <textarea
            value={text}
            onChange={handleTextChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="在这里粘贴你的原始文章内容...&#10;&#10;支持任意长度的文章，AI会自动识别段落结构，改写成适合小红书阅读的风格，并为每段生成精美配图。"
            className="w-full h-80 p-6 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl
                       text-text-primary placeholder:text-text-muted/70 text-lg leading-relaxed resize-none
                       focus:outline-none focus:bg-white focus:border-white
                       transition-all duration-300 shadow-inner"
          />

          {/* Floating Paste Button */}
          {!text && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.button
                onClick={handlePaste}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-xl
                           bg-white shadow-card text-primary-600 font-medium
                           hover:text-primary-700 hover:shadow-card-hover
                           transition-all duration-300 group/btn"
              >
                <Clipboard className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                点击粘贴内容
              </motion.button>
            </div>
          )}

          {/* Quick Actions (Bottom Right) */}
          {text && (
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handlePaste}
                className="p-2 rounded-xl bg-white/80 hover:bg-white text-text-secondary hover:text-primary-600
                           shadow-sm hover:shadow transition-all duration-200"
                title="重新粘贴"
              >
                <Clipboard className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/50 border border-white/60">
            <span className={charCount < minChars ? 'text-text-muted' : 'text-primary-600 font-semibold'}>
              {charCount} 字
            </span>
            <span className="text-text-muted/60">/</span>
            <span className="text-text-muted">至少 50 字</span>
          </div>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={charCount < minChars}
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg
            transition-all duration-300
            ${charCount < minChars
              ? 'bg-gray-300 cursor-not-allowed shadow-none opacity-70'
              : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/40 hover:shadow-primary-500/60'
            }
          `}
        >
          下一步
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  )
}
