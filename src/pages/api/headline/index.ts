import { VercelRequest, VercelResponse } from '@vercel/node'

import { scrape as Scrape } from '@services/scraper'
import { News } from '@constants/NEWS'

const Headline = async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  try {
    console.error(request.body)
    console.error('here')
    await Scrape(News[2])
  } catch (error) {
    console.error('error: ' + error)
    response.status(500).send(error)
  }
  response.status(200).end()
}

export default Headline
