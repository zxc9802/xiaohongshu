import { NextRequest, NextResponse } from 'next/server'

// 强制动态渲染
export const dynamic = 'force-dynamic'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

export async function POST(request: NextRequest) {
  try {
    const { rawText, toneId, freePrompt } = await request.json()

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: '文章内容不能少于50字' }, { status: 400 })
    }

    // 根据语气模板生成系统提示词
    const tonePrompts: Record<string, string> = {
      casual: '用轻松亲切的语气，像朋友分享一样，多用"姐妹们"、"宝子们"等称呼',
      professional: '用专业客观的语气，有理有据，适当使用数据和对比',
      storytelling: '用故事叙述的方式，娓娓道来，有情节感和代入感',
      funny: '用幽默搞笑的语气，轻松有趣，加入一些网络流行语',
      emotional: '用真挚动人的语气，触动心弦，引发情感共鸣',
    }

    const toneInstruction = tonePrompts[toneId] || tonePrompts.casual
    const additionalPrompt = freePrompt ? `\n额外要求：${freePrompt}` : ''

    // 根据文章长度计算段落数量：每200字约1段，最少6段，最多12段
    const textLength = rawText.length
    const minSections = 6
    const maxSections = 12
    const calculatedSections = Math.max(minSections, Math.min(maxSections, Math.ceil(textLength / 200)))

    const systemPrompt = `你是一位资深的小红书内容创作者。请将用户提供的长文章改写成适合小红书发布的风格。

要求：
1. ${toneInstruction}
2. 【重要】把文章拆分成${calculatedSections}个段落，每段50-80字左右，简短精炼
3. 每段开头加入1-2个表情符号增加活力
4. 语言要接地气，口语化，符合小红书用户的阅读习惯
5. 保留原文的核心信息和观点
6. 每一段都要有独立的主题，适合配一张图${additionalPrompt}

请以JSON格式返回，格式如下：
{
  "sections": [
    {"section_id": "1", "section_text": "第一段改写内容（50-80字）", "order": 1},
    {"section_id": "2", "section_text": "第二段改写内容（50-80字）", "order": 2},
    ...
  ]
}

注意：必须生成${calculatedSections}个段落，每段50-80字。只返回JSON，不要其他解释。`

    const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `请改写以下文章：\n\n${rawText}` }
        ],
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepSeek API Error:', errorText)
      return NextResponse.json({ error: '改写服务暂时不可用' }, { status: 500 })
    }

    const data = await response.json()

    // 解析返回的内容
    let content = data.choices?.[0]?.message?.content || ''

    // 尝试提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('Failed to parse response:', content)
      return NextResponse.json({ error: '解析改写结果失败' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      rewritten_text: result.sections.map((s: any) => s.section_text).join('\n\n'),
      sections: result.sections.map((s: any, index: number) => ({
        section_id: s.section_id || String(index + 1),
        section_text: s.section_text,
        order: s.order || index + 1,
      }))
    })

  } catch (error) {
    console.error('Rewrite error:', error)
    return NextResponse.json({ error: '改写失败，请重试' }, { status: 500 })
  }
}
