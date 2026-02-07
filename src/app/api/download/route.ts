import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    const filename = searchParams.get('filename') || 'image.png'

    if (!imageUrl) {
      return NextResponse.json({ error: '缺少图片URL' }, { status: 400 })
    }

    // 从远程URL获取图片
    const response = await fetch(imageUrl)

    if (!response.ok) {
      return NextResponse.json({ error: '获取图片失败' }, { status: 500 })
    }

    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()

    // 返回图片作为下载
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Content-Length': arrayBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: '下载失败' }, { status: 500 })
  }
}
