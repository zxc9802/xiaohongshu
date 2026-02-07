// 类型定义
export interface Section {
  section_id: string
  section_text: string
  order: number
  image_url?: string
  audit_status?: 'pass' | 'block' | 'review'
  error_code?: string | null
}

export interface RewriteResult {
  rewritten_text: string
  sections: Section[]
}

export interface TaskState {
  status: 'idle' | 'rewriting' | 'generating' | 'done' | 'error'
  progress: number
  currentStep: string
  error?: string
}

export interface ToneTemplate {
  id: string
  name: string
  description: string
  icon: string
}

export interface StyleTemplate {
  id: string
  name: string
  description: string
  preview: string
}

// 预设语气模板
export const toneTemplates: ToneTemplate[] = [
  { id: 'casual', name: '轻松种草', description: '亲切自然，像朋友分享', icon: '💬' },
  { id: 'professional', name: '专业测评', description: '客观详细，有理有据', icon: '📊' },
  { id: 'storytelling', name: '故事叙述', description: '娓娓道来，引人入胜', icon: '📖' },
  { id: 'funny', name: '幽默搞笑', description: '轻松有趣，笑点满满', icon: '😄' },
  { id: 'emotional', name: '情感共鸣', description: '真挚动人，触动心弦', icon: '💕' },
]

// 预设配图风格模板
export const styleTemplates: StyleTemplate[] = [
  { id: 'food', name: '美食探店', description: '暖色调、食物特写', preview: '/previews/food.jpg' },
  { id: 'travel', name: '旅行日记', description: '风景大片、清新自然', preview: '/previews/travel.jpg' },
  { id: 'fashion', name: '穿搭分享', description: '时尚街拍、简约大气', preview: '/previews/fashion.jpg' },
  { id: 'lifestyle', name: '生活日常', description: '温馨居家、ins风格', preview: '/previews/lifestyle.jpg' },
  { id: 'beauty', name: '美妆护肤', description: '柔光特写、产品展示', preview: '/previews/beauty.jpg' },
  { id: 'knowledge', name: '知识分享', description: '清晰图表、文字排版', preview: '/previews/knowledge.jpg' },
]
