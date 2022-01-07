import { NextRequest, NextResponse } from 'next/server'

import { HTTP_451, HTTP_418 } from '@constants/CONTENT'
import { ALLOWED_COUNTRY, BLOCKED_COUNTRY } from '@constants/GEO_LOCK'
import { ipRateLimit } from '@lib/ip-rate-limit'

export async function middleware(req: NextRequest): Promise<Response> {
  const { geo } = req
  const country = geo?.country || 'XX'

  if (ALLOWED_COUNTRY.length === 0 || ALLOWED_COUNTRY.includes(country)) {
    const res = await ipRateLimit(req)
    if (res.status !== 200) return res
    return NextResponse.next()
  } else if (BLOCKED_COUNTRY.includes(country)) {
    return new Response(
      JSON.stringify({
        error: HTTP_451,
      }),
      {
        status: 451,
      }
    )
  } else {
    return new Response(JSON.stringify({ error: HTTP_418 }), {
      status: 418,
    })
  }
}
