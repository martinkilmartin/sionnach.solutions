import { ReactNode } from 'react'

import { PageTitle } from '@components/PageTitle'

type Props = {
  title: string
  children: ReactNode
}

const MainContent = ({ title, children }: Props): JSX.Element => (
  <div className="px-4">
    <PageTitle title={title} />
    {children}
  </div>
)

export default MainContent
