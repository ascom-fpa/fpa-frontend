import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const videoUrl = searchParams.get('url')

    if (!videoUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
    }

    // Fetch the video from R2 or any remote source
    const res = await fetch(videoUrl, {
      cache: 'force-cache', // Let Next.js and the edge cache it
      headers: {
        Range: req.headers.get('Range') || '', // Handle range requests for streaming
      },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch video (${res.status})` }, { status: res.status })
    }

    // Forward video bytes
    const buffer = await res.arrayBuffer()

    const headers = new Headers()
    headers.set('Content-Type', res.headers.get('content-type') || 'video/mp4')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Access-Control-Allow-Origin', '*')

    // Support byte-range streaming (important for video players)
    const contentRange = res.headers.get('Content-Range')
    if (contentRange) headers.set('Content-Range', contentRange)
    if (res.status === 206) headers.set('Accept-Ranges', 'bytes')

    return new NextResponse(buffer, { status: res.status, headers })
  } catch (error) {
    console.error('Cache video error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}