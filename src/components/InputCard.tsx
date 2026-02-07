'use client'

import React, { useState } from 'react'

interface InputCardProps {
  onNext: (text: string) => void
  initialText?: string
}

export default function InputCard({ onNext, initialText = '' }: InputCardProps) {
  const [text, setText] = useState(initialText)
  const [charCount, setCharCount] = useState(initialText.length)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    setCharCount(newText.length)
  }

  const handleSubmit = () => {
    if (text.trim().length < 50) {
      alert('请输入至少50字的文章内容')
      return
    }
    onNext(text)
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
      setCharCount(clipboardText.length)
    } catch (err) {
      console.error('粘贴失败:', err)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-card p-8 animate-fade-in card-hover">
      {/* 卡片头部 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white shadow-button">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">粘贴你的长文章</h2>
          <p className="text-sm text-text-muted">AI将帮你改写成小红书风格</p>
        </div>
      </div>

      {/* 文本输入区 */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="在这里粘贴你的原始文章内容...&#10;&#10;支持任意长度的文章，AI会自动识别段落结构，改写成适合小红书阅读的风格，并为每段生成精美配图。"
          className="w-full h-64 p-5 bg-primary-50/50 border-2 border-transparent rounded-2xl
                     text-text-primary placeholder:text-text-muted/60 resize-none
                     focus:border-primary-300 focus:bg-white
                     transition-all duration-300"
        />

        {/* 快捷操作栏 */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                       bg-white/80 text-text-secondary text-sm font-medium
                       hover:bg-primary-100 hover:text-primary-600 cursor-pointer
                       transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            粘贴
          </button>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4">
          <span className={`text-sm ${charCount < 50 ? 'text-text-muted' : 'text-primary-500'}`}>
            已输入 <strong>{charCount}</strong> 字
          </span>
          {charCount < 50 && (
            <span className="text-xs text-text-muted">建议至少50字</span>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={charCount < 50}
          className="btn-primary flex items-center gap-2"
        >
          下一步：选择风格
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
