'use client'

import React, { useState } from 'react'
import { InputCard, ConfigCard, ResultCard, StepIndicator, TaskProgress } from '@/components'
import { Section, TaskState } from '@/types'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [rawText, setRawText] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [fullText, setFullText] = useState('')
  const [taskState, setTaskState] = useState<TaskState>({
    status: 'idle',
    progress: 0,
    currentStep: '',
  })

  const stepLabels = ['输入原文', '选择风格', '生成结果']

  // 处理第一步提交
  const handleInputSubmit = (text: string) => {
    setRawText(text)
    setCurrentStep(2)
  }

  // 返回第一步
  const handleBackToInput = () => {
    setCurrentStep(1)
  }

  // 开始生成
  const handleGenerate = async (config: {
    toneId: string
    styleId: string | null
    freePrompt: string
    useTemplate: boolean
  }) => {
    console.log('生成配置:', config)

    try {
      // 第一步：调用改写API
      setTaskState({
        status: 'rewriting',
        progress: 10,
        currentStep: 'AI正在改写文案...',
      })

      const rewriteResponse = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          toneId: config.toneId,
          freePrompt: config.freePrompt,
        }),
      })

      if (!rewriteResponse.ok) {
        const error = await rewriteResponse.json()
        throw new Error(error.error || '改写失败')
      }

      const rewriteResult = await rewriteResponse.json()
      const rewrittenSections: Section[] = rewriteResult.sections.map((s: any) => ({
        ...s,
        image_url: undefined,
        audit_status: 'pass' as const,
      }))

      setTaskState({
        status: 'rewriting',
        progress: 30,
        currentStep: '文案改写完成，正在生成配图...',
      })

      // 第二步：为每个段落生成配图
      setTaskState({
        status: 'generating',
        progress: 35,
        currentStep: `正在生成配图 (0/${rewrittenSections.length})...`,
      })

      const sectionsWithImages: Section[] = []

      for (let i = 0; i < rewrittenSections.length; i++) {
        const section = rewrittenSections[i]

        setTaskState({
          status: 'generating',
          progress: 35 + ((i / rewrittenSections.length) * 60),
          currentStep: `正在生成配图 (${i + 1}/${rewrittenSections.length})...`,
        })

        try {
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sectionText: section.section_text,
              styleId: config.styleId,
              freePrompt: config.freePrompt,
            }),
          })

          if (imageResponse.ok) {
            const imageResult = await imageResponse.json()
            sectionsWithImages.push({
              ...section,
              image_url: imageResult.image_url,
              audit_status: imageResult.audit_status || 'pass',
            })
          } else {
            // 图片生成失败，但继续处理其他段落
            sectionsWithImages.push({
              ...section,
              image_url: undefined,
              audit_status: 'review',
              error_code: 'IMAGE_GENERATION_FAILED',
            })
          }
        } catch (imgError) {
          console.error(`段落 ${i + 1} 图片生成失败:`, imgError)
          sectionsWithImages.push({
            ...section,
            image_url: undefined,
            audit_status: 'review',
            error_code: 'IMAGE_GENERATION_FAILED',
          })
        }
      }

      // 完成
      setTaskState({
        status: 'done',
        progress: 100,
        currentStep: '生成完成！',
      })

      // 设置结果数据
      setSections(sectionsWithImages)
      setFullText(sectionsWithImages.map(s => s.section_text).join('\n\n'))

      // 短暂延迟后进入结果页
      setTimeout(() => {
        setCurrentStep(3)
        setTaskState({ status: 'idle', progress: 0, currentStep: '' })
      }, 1000)

    } catch (error) {
      console.error('生成失败:', error)
      setTaskState({
        status: 'error',
        progress: 0,
        currentStep: '生成失败',
        error: error instanceof Error ? error.message : '未知错误，请重试',
      })

      // 3秒后重置状态
      setTimeout(() => {
        setTaskState({ status: 'idle', progress: 0, currentStep: '' })
      }, 3000)
    }
  }

  // 重新开始
  const handleReset = () => {
    setCurrentStep(1)
    setRawText('')
    setSections([])
    setFullText('')
  }

  // 重试某一段图片生成
  const handleRetrySection = async (sectionId: string) => {
    const section = sections.find(s => s.section_id === sectionId)
    if (!section) return

    setTaskState({
      status: 'generating',
      progress: 50,
      currentStep: `正在重新生成段落 ${section.order} 的配图...`,
    })

    try {
      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionText: section.section_text,
          styleId: null,
          freePrompt: '',
        }),
      })

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json()
        setSections(prev => prev.map(s =>
          s.section_id === sectionId
            ? { ...s, image_url: imageResult.image_url, audit_status: 'pass', error_code: null }
            : s
        ))
      }

      setTaskState({ status: 'idle', progress: 0, currentStep: '' })
    } catch (error) {
      console.error('重试失败:', error)
      setTaskState({
        status: 'error',
        progress: 0,
        currentStep: '重试失败',
        error: '图片生成失败，请稍后再试',
      })

      setTimeout(() => {
        setTaskState({ status: 'idle', progress: 0, currentStep: '' })
      }, 3000)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4">
      {/* 顶部导航 */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center gap-3">
          {/* Logo */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-button">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">小红书文生图</h1>
            <p className="text-sm text-text-muted">3步完成小红书图文发布</p>
          </div>
        </div>
      </header>

      {/* 步骤指示器 */}
      <div className="max-w-4xl mx-auto">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={3}
          stepLabels={stepLabels}
        />
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <InputCard
            onNext={handleInputSubmit}
            initialText={rawText}
          />
        )}

        {currentStep === 2 && (
          <ConfigCard
            onBack={handleBackToInput}
            onGenerate={handleGenerate}
          />
        )}

        {currentStep === 3 && (
          <ResultCard
            sections={sections}
            fullText={fullText}
            onReset={handleReset}
            onRetrySection={handleRetrySection}
          />
        )}
      </div>

      {/* 任务进度提示 */}
      <TaskProgress taskState={taskState} />

      {/* 页脚 */}
      <footer className="max-w-4xl mx-auto mt-12 text-center">
        <p className="text-sm text-text-muted">
          游客模式 · 无需登录即可使用
        </p>
        <p className="text-xs text-text-muted/60 mt-2">
          图片比例固定为 3:4 · 小红书最佳展示效果
        </p>
      </footer>
    </main>
  )
}
