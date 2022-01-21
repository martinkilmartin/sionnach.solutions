import { MainContent } from '@layouts/MainContent'

type Props = {
  title: string
}

const Game = ({ title }: Props): JSX.Element => (
  <MainContent title={title}>
    <p className="text-center">〽</p>
  </MainContent>
)

export default Game
