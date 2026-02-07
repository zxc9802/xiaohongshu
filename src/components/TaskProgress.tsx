'use client'

import React from 'react'
import { TaskState } from '@/types'

interface TaskProgressProps {
  taskState: TaskState
}

export default function TaskProgress({ taskState }: TaskProgressProps) {
  const { status, progress, currentStep, error } = taskState

  if (status === 'idle') return null

  const getStatusColor = () => {
    switch (status) {
      case 'rewriting':
      case 'generating':
        return 'from-primary-500 to-primary-400'
      case 'done':
        return 'from-green-500 to-green-400'
      case 'error':
        return 'from-red-500 to-red-400'
      default:
        return 'from-gray-400 to-gray-300'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'rewriting':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )
      case 'generating':
        return (
          <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'done':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-card-hover border border-primary-100 px-6 py-4 min-w-[320px]">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStatusColor()} flex items-center justify-center text-white`}>
            {getStatusIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">{currentStep}</p>
            {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
          </div>
          <span className="text-sm font-medium text-primary-500">{Math.round(progress)}%</span>
        </div>

        {/* 进度条 */}
        <div className="h-2 bg-primary-50 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getStatusColor()} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
