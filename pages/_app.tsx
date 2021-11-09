import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { BOTD } from '@components/BOTD'

const ThemeChange = require('theme-change')
const { themeChange } = ThemeChange

import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  useEffect(() => {
    themeChange(false)
  }, [])
  return (
    <BOTD>
      <Component {...pageProps} />
    </BOTD>
  )
}

export default MyApp
