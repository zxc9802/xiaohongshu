'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Sparkles, ChevronLeft, Zap, Palette, Type, LayoutTemplate, MessageSquare } from 'lucide-react'
import { toneTemplates, styleTemplates } from '@/types'

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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden"
    >
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary-100/30 rounded-full blur-3xl -z-10 translate-y-[-50%] translate-x-[-50%]" />

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 shrink-0">
          <Settings className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">定制风格</h2>
          <p className="text-text-secondary">选择适合的语气和配图风格，打造爆款内容</p>
        </div>
      </div>

      {/* Tone Selection */}
      <div className="mb-10">
        <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          <MessageSquare className="w-4 h-4" />
          改写语气
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {toneTemplates.map((tone) => (
            <motion.button
              key={tone.id}
              onClick={() => setSelectedTone(tone.id)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-2xl text-left cursor-pointer overflow-hidden
                transition-all duration-300 border
                ${selectedTone === tone.id
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 border-transparent text-white shadow-lg shadow-primary-500/30'
                  : 'bg-white/60 hover:bg-white border-white/60 hover:border-white shadow-sm hover:shadow-md text-text-primary'
                }
              `}
            >
              <span className="text-2xl mb-2 block">{tone.icon}</span>
              <p className={`font-bold text-sm mb-1 ${selectedTone === tone.id ? 'text-white' : 'text-text-primary'}`}>
                {tone.name}
              </p>
              <p className={`text-xs leading-relaxed ${selectedTone === tone.id ? 'text-white/80' : 'text-text-muted'}`}>
                {tone.description}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Image Style Selection Mode */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          <Palette className="w-4 h-4" />
          配图方式
        </label>
        <div className="flex p-1.5 bg-primary-50/50 rounded-2xl border border-primary-100/50 relative">
          <motion.div
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm z-0"
            animate={{
              left: useTemplate ? '0.375rem' : '50%',
              right: useTemplate ? '50%' : '0.375rem',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setUseTemplate(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold z-10 transition-colors duration-200 ${useTemplate ? 'text-primary-600' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <LayoutTemplate className="w-4 h-4" />
            预设模板
          </button>
          <button
            onClick={() => setUseTemplate(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold z-10 transition-colors duration-200 ${!useTemplate ? 'text-primary-600' : 'text-text-muted hover:text-text-secondary'}`}
          >
            <Type className="w-4 h-4" />
            自由提示词
          </button>
        </div>
      </div>

      {/* Style Templates Grid */}
      <AnimatePresence mode="wait">
        {useTemplate ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {styleTemplates.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    group relative rounded-2xl cursor-pointer overflow-hidden aspect-[4/3]
                    transition-all duration-300 border-2
                    ${selectedStyle === style.id
                      ? 'border-primary-500 ring-4 ring-primary-100 shadow-xl'
                      : 'border-transparent hover:border-primary-200 shadow-md'
                    }
                  `}
                >
                  {/* Style Preview Image */}
                  <img
                    src={style.preview}
                    alt={style.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 text-left">
                    <p className="text-white font-bold text-sm drop-shadow-md">{style.name}</p>
                    <p className="text-white/80 text-xs truncate max-w-full">{style.description}</p>
                  </div>

                  {/* Selected Indicator */}
                  {selectedStyle === style.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 shadow-lg flex items-center justify-center border-2 border-white animate-scale-in">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="free-prompt"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <textarea
              value={freePrompt}
              onChange={(e) => setFreePrompt(e.target.value)}
              placeholder="描述你想要的配图风格，例如：极简白底、产品特写、ins风格滤镜..."
              className="w-full h-32 p-4 bg-white/60 backdrop-blur-sm border border-white/60 rounded-2xl
                         text-text-primary placeholder:text-text-muted/60 resize-none
                         focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-100
                         transition-all duration-300 shadow-inner"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-primary-100/50">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回修改
        </motion.button>

        <motion.button
          onClick={handleGenerate}
          whileHover={{ scale: 1.02, translateY: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r from-primary-500 to-primary-600 shadow-primary-500/40 hover:shadow-primary-500/60 transition-all duration-300"
        >
          <Zap className="w-5 h-5 fill-current" />
          开始生成
        </motion.button>
      </div>
    </motion.div>
  )
}

// Helper to generate different gradients for styles
function getGradientForStyle(styleId: string): string {
  switch (styleId) {
    case 'photography': return 'from-orange-100 to-amber-200'
    case 'illustration': return 'from-blue-100 to-cyan-200'
    case 'minimalist': return 'from-gray-100 to-slate-200'
    case 'tech': return 'from-violet-100 to-fuchsia-200'
    case 'lifestyle': return 'from-green-100 to-emerald-200'
    default: return 'from-primary-100 to-primary-200'
  }
}
