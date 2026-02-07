import { NextRequest, NextResponse } from 'next/server'

// 强制动态渲染
export const dynamic = 'force-dynamic'

const ARK_API_KEY = process.env.ARK_API_KEY
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3'
const ARK_IMAGE_MODEL = process.env.ARK_IMAGE_MODEL || 'doubao-seedream-4-5-251128'

export async function POST(request: NextRequest) {
  try {
    const { sectionText, styleId, freePrompt } = await request.json()

    if (!sectionText) {
      return NextResponse.json({ error: '段落内容不能为空' }, { status: 400 })
    }

    // 根据风格模板生成配图提示词
    const stylePrompts: Record<string, string> = {
      food: '美食摄影风格，暖色调，食物特写，精致摆盘，柔和光线，ins美食博主风格',
      travel: '旅行风景大片，清新自然，蓝天白云，广角视角，明亮色调，治愈系风格',
      fashion: '时尚街拍风格，简约大气，都市感，高级质感，杂志封面感',
      lifestyle: '温馨居家风格，ins简约风，柔和滤镜，生活气息，自然光线',
      beauty: '美妆产品风格，柔光特写，干净背景，产品展示，精致细腻',
      knowledge: '知识分享风格，清晰简洁，文字排版，图表设计，专业感',
    }

    const styleInstruction = stylePrompts[styleId] || '小红书风格，精致美观，色彩明亮，符合年轻人审美'
    const additionalStyle = freePrompt ? `，${freePrompt}` : ''

    // 基于段落内容生成配图提示词
    const imagePrompt = `根据以下内容生成配图：${sectionText.substring(0, 100)}。
风格要求：${styleInstruction}${additionalStyle}，
画面精致，适合小红书发布，3:4竖版构图，高清画质，细腻质感`

    const response = await fetch(`${ARK_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ARK_IMAGE_MODEL,
        prompt: imagePrompt,
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Image API Error:', errorText)
      return NextResponse.json({ error: '图片生成服务暂时不可用' }, { status: 500 })
    }

    const data = await response.json()

    // 解析返回的图片URL
    let imageUrl = ''
    if (data.data?.[0]?.url) {
      imageUrl = data.data[0].url
    } else if (data.url) {
      imageUrl = data.url
    } else if (data.output?.url) {
      imageUrl = data.output.url
    }

    if (!imageUrl) {
      console.error('No image URL in response:', data)
      return NextResponse.json({ error: '未能获取生成的图片' }, { status: 500 })
    }

    return NextResponse.json({
      image_url: imageUrl,
      audit_status: 'pass',
    })

  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: '图片生成失败，请重试' }, { status: 500 })
  }
}
