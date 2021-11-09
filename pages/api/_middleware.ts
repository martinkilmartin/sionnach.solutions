import { NextRequest, NextResponse } from 'next/server'
import { botdEdge } from '@lib/botd'
import { ipRateLimit } from '@lib/ip-rate-limit'
import getIP from '@lib/get-ip'
import { ALLOWED_COUNTRY, BLOCKED_COUNTRY } from '@constants/GEO_LOCK'

export async function middleware(req: NextRequest): Promise<Response> {
  const { nextUrl: url, geo } = req
  const country = geo.country || 'XX'
  console.error(`country:${country}`)
  console.error(`allowed:${ALLOWED_COUNTRY.includes(country)}`)
  const bot = await botdEdge(req, {
    // The request id is excluded for demo purposes because
    // Botd remembers your request id and will always show
    // you the /bot-detected page if you're a bot, and
    // never if you have been identified as a human
    useRequestId: false,
  })
  console.error(`bot:${bot}`)
  if (ALLOWED_COUNTRY.includes(country)) {
    if (bot && bot.status !== 200) return bot
    const res = await ipRateLimit(req)
    if (res.status !== 200) return res
    url.searchParams.set('country', country)
    url.searchParams.set('ip', getIP(req))
    return NextResponse.rewrite(url)
  } else if (BLOCKED_COUNTRY.includes(country)) {
    return new Response('Blocked for legal reasons', { status: 451 })
  } else {
    return new Response('Limited audience', { status: 451 })
  }
}
