import { Auth } from '@supabase/ui'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

import { supabase } from '@services/supabase'

const ThemeChange = require('theme-change')
const { themeChange } = ThemeChange

import 'tailwindcss/tailwind.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  useEffect(() => {
    themeChange(false)
  }, [])
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Component {...pageProps} />
    </Auth.UserContextProvider>
  )
}

export default MyApp
