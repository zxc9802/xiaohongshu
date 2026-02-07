'use client'

import React from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <React.Fragment key={stepNumber}>
            {/* 步骤圆圈 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-medium text-sm transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white shadow-button'
                    : isCompleted
                      ? 'bg-primary-500 text-white'
                      : 'bg-primary-50 text-primary-300'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`
                  text-xs font-medium transition-colors duration-300
                  ${isActive ? 'text-primary-500' : isCompleted ? 'text-primary-400' : 'text-text-muted'}
                `}
              >
                {stepLabels[index]}
              </span>
            </div>

            {/* 连接线 */}
            {index < totalSteps - 1 && (
              <div
                className={`
                  w-16 h-0.5 rounded-full transition-colors duration-300 -mt-6
                  ${stepNumber < currentStep ? 'bg-primary-400' : 'bg-primary-100'}
                `}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
