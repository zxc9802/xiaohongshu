'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="relative flex flex-col items-center justify-center mb-12">
      <div className="flex items-center gap-4 md:gap-8 relative z-10 p-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center group">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -4 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-soft transition-all duration-300 relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow ring-4 ring-primary-100'
                      : isCompleted
                        ? 'bg-white text-primary-500 border-2 border-primary-500'
                        : 'bg-white/80 text-text-muted border border-white/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="step-glow"
                      className="absolute inset-0 bg-white/20 blur-sm"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={{
                    color: isActive ? '#FF2442' : isCompleted ? '#1A1A1A' : '#999999',
                    y: isActive ? 4 : 0,
                    fontWeight: isActive ? 600 : 500,
                  }}
                  className="absolute top-14 text-xs whitespace-nowrap bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg"
                >
                  {stepLabels[index]}
                </motion.span>
              </div>

              {/* Connecting Line */}
              {index < totalSteps - 1 && (
                <div className="w-16 md:w-24 h-1 rounded-full bg-white/50 backdrop-blur-sm mx-2 overflow-hidden shadow-inner-light">
                  <motion.div
                    initial={false}
                    animate={{
                      width: stepNumber < currentStep ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
