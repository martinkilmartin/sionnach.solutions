import { NextApiRequest, NextApiResponse } from 'next'

import { scrape as Scrape } from '@services/scraper'
import { News } from '@constants/NEWS'

const Headline = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const { HEADLINE_API_KEY } = process.env
  const ACTION_KEY = request.headers.authorization?.split(' ')[1] ?? ''
  try {
    if (ACTION_KEY === HEADLINE_API_KEY && HEADLINE_API_KEY.length > 15) {
      const { source = '0' } = request.query

      await Scrape(News[parseInt(source[0])])

      response.status(200).end()
    } else {
      response.status(401).end()
    }
  } catch (error) {
    response.status(500).send(error)
  }
}

export default Headline
