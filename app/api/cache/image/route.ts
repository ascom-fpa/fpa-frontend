import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const imageUrl = searchParams.get('url')
  if (!imageUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  const r = await fetch(imageUrl, { cache: 'force-cache' })
  const buffer = await r.arrayBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': r.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  })
}