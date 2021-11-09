import { NextRequest, NextResponse } from 'next/server'
import { botdEdge } from '@lib/botd'
import { ipRateLimit } from '@lib/ip-rate-limit'
import getIP from '@lib/get-ip'
import { ALLOWED_COUNTRY, BLOCKED_COUNTRY } from '@constants/GEO_LOCK'

export async function middleware(req: NextRequest): Promise<Response> {
  const { nextUrl: url, geo } = req
  const country = geo.country || 'XX'
  const botRes = await botdEdge(req)
  if (botRes && botRes.status !== 200) {
    return new Response('roblox', { status: 403 })
  } else if (ALLOWED_COUNTRY.includes(country)) {
    const ipLimitRes = await ipRateLimit(req)
    if (ipLimitRes.status !== 200) return ipLimitRes
    url.searchParams.set('country', country)
    url.searchParams.set('ip', getIP(req))
    return NextResponse.rewrite(url)
  } else if (BLOCKED_COUNTRY.includes(country)) {
    return new Response('Blocked for legal reasons', { status: 451 })
  } else {
    return new Response(`Limited audience ${country}, bot ${botRes}`, {
      status: 451,
    })
  }
}
