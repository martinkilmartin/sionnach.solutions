import { useState, useEffect } from 'react'
import { supabase } from '@services/supabase'
import { APP_TITLE, TAG_LINE } from '@constants/CONTENT'
import { Container } from '@layouts/Container'
import { Page } from '@layouts/Page'
import { Auth } from '@components/Auth'
import { Account } from '@components/Account'
import { MainContent } from '@layouts/MainContent'
import { AuthSession } from '@supabase/supabase-js'

const HomePage = (): JSX.Element => {
  const [session, setSession] = useState<AuthSession | null>(null)
  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        setSession(session)
      }
    )
  }, [])

  return (
    <Container>
      <Page title={APP_TITLE} heading={TAG_LINE}>
        {!session ? (
          <MainContent title="🤨">
            <Auth />
          </MainContent>
        ) : (
          <MainContent title="Cuntas">
            <Account key={session?.user?.id} session={session} />
          </MainContent>
        )}
      </Page>
    </Container>
  )
}

export default HomePage
