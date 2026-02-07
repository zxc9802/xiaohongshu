'use client'

import React, { useState } from 'react'
import { toneTemplates, styleTemplates, ToneTemplate, StyleTemplate } from '@/types'

interface ConfigCardProps {
  onBack: () => void
  onGenerate: (config: {
    toneId: string
    styleId: string | null
    freePrompt: string
    useTemplate: boolean
  }) => void
}

export default function ConfigCard({ onBack, onGenerate }: ConfigCardProps) {
  const [selectedTone, setSelectedTone] = useState<string>(toneTemplates[0].id)
  const [useTemplate, setUseTemplate] = useState(true)
  const [selectedStyle, setSelectedStyle] = useState<string>(styleTemplates[0].id)
  const [freePrompt, setFreePrompt] = useState('')

  const handleGenerate = () => {
    onGenerate({
      toneId: selectedTone,
      styleId: useTemplate ? selectedStyle : null,
      freePrompt,
      useTemplate,
    })
  }

  return (
    <div className="bg-white rounded-3xl shadow-card p-8 animate-fade-in card-hover">
      {/* 卡片头部 */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center text-white shadow-button">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">选择风格与规则</h2>
          <p className="text-sm text-text-muted">定制你的小红书图文风格</p>
        </div>
      </div>

      {/* 改写语气选择 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-text-primary mb-3">
          改写语气
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {toneTemplates.map((tone) => (
            <button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              className={`
                p-4 rounded-2xl border-2 text-left cursor-pointer
                transition-all duration-200
                ${selectedTone === tone.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-100 hover:border-primary-200 hover:bg-primary-50/50'
                }
              `}
            >
              <span className="text-2xl mb-2 block">{tone.icon}</span>
              <p className="font-medium text-text-primary text-sm">{tone.name}</p>
              <p className="text-xs text-text-muted mt-1">{tone.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 配图方式切换 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-primary mb-3">
          配图方式
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setUseTemplate(true)}
            className={`
              flex-1 py-3 px-4 rounded-2xl font-medium cursor-pointer
              transition-all duration-200
              ${useTemplate
                ? 'bg-primary-500 text-white shadow-button'
                : 'bg-primary-50 text-primary-500 hover:bg-primary-100'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              预设模板
            </div>
          </button>
          <button
            onClick={() => setUseTemplate(false)}
            className={`
              flex-1 py-3 px-4 rounded-2xl font-medium cursor-pointer
              transition-all duration-200
              ${!useTemplate
                ? 'bg-primary-500 text-white shadow-button'
                : 'bg-primary-50 text-primary-500 hover:bg-primary-100'
              }
            `}
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              自由提示词
            </div>
          </button>
        </div>
      </div>

      {/* 预设模板选择 */}
      {useTemplate && (
        <div className="mb-6 animate-fade-in">
          <label className="block text-sm font-medium text-text-primary mb-3">
            选择配图风格
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {styleTemplates.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`
                  relative p-4 rounded-2xl border-2 text-left cursor-pointer overflow-hidden
                  transition-all duration-200
                  ${selectedStyle === style.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-100 hover:border-primary-200'
                  }
                `}
              >
                {/* 预览色块 */}
                <div className="w-full h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 mb-3" />
                <p className="font-medium text-text-primary text-sm">{style.name}</p>
                <p className="text-xs text-text-muted mt-1">{style.description}</p>

                {selectedStyle === style.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 自由提示词输入 */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-text-primary mb-3">
          {useTemplate ? '补充提示词（可选）' : '自由提示词'}
        </label>
        <textarea
          value={freePrompt}
          onChange={(e) => setFreePrompt(e.target.value)}
          placeholder={useTemplate
            ? '例如：添加一些复古滤镜效果、使用暖色调...'
            : '描述你想要的配图风格，例如：极简白底、产品特写、ins风格滤镜...'
          }
          className="w-full h-24 p-4 bg-primary-50/50 border-2 border-transparent rounded-2xl
                     text-text-primary placeholder:text-text-muted/60 resize-none
                     focus:border-primary-300 focus:bg-white
                     transition-all duration-300"
        />
      </div>

      {/* 图片比例提示 */}
      <div className="mb-8 p-4 bg-primary-50/50 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">图片比例：3:4</p>
            <p className="text-xs text-text-muted">小红书最佳展示比例，固定生成</p>
          </div>
        </div>
      </div>

      {/* 底部操作区 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          上一步
        </button>

        <button
          onClick={handleGenerate}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          开始生成
        </button>
      </div>
    </div>
  )
}
