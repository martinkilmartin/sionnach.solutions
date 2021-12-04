import { NewsSource } from 'src/types/NewsSource'
import { hashCode } from '@lib/hashing'
import { HeadlineExists, AddHeadline } from '@services/supabase'

const { chromium } = require('playwright-core')

export async function scrape(paper: NewsSource): Promise<boolean> {
  console.error('ici')

  const browser = await chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(0)

  try {
    await page.goto(paper.url)
  } catch (error) {
    console.error('❌ No page found for ' + paper.id + '!')
    console.error('❌ ERROR: ' + error)
  }

  let headline = ''
  if (paper.headlinePath.length) {
    try {
      headline = await page.$eval(
        paper.headlinePath,
        (headlineElm: HTMLElement) => headlineElm.innerText
      )
    } catch (error) {
      console.error('❌ Headline not found for ' + paper.id + '!')
      console.error('❌ ERROR: ' + error)
    }
  }

  let section = 'NEWS'
  if (paper.sectionPath.length) {
    try {
      section = await page.$eval(paper.sectionPath, (sectionElm: HTMLElement) =>
        sectionElm.innerText.toUpperCase()
      )
    } catch (error) {
      if (paper.id !== 'IE_TIME')
        console.error('❌ Category not found for ' + paper.id + '!')
      console.error('❌ ERROR: ' + error)
    }
  }

  let link = ''
  if (paper.linkPath.length) {
    try {
      link = await page.$eval(
        paper.linkPath,
        (urlElm: HTMLAnchorElement) => urlElm.href
      )
    } catch (error) {
      console.error('❌ Link not found for ' + paper.id + '!')
      console.error('❌ ERROR: ' + error)
    }
  }

  if (headline.length) {
    if (headline.startsWith('LATEST ')) {
      headline = headline.substring(7)
    } else if (headline.startsWith('EXCLUSIVE ')) {
      headline = headline.substring(10)
    }
    const hashedLine = hashCode(paper.id + headline.replace(/\s/g, ''))
    console.error(`${hashedLine} ${headline} ` + paper.id + '!')
    const exists = await HeadlineExists(hashedLine)
    if (!exists) {
      await AddHeadline({
        id: hashedLine,
        source: paper.id,
        section: section,
        headline: headline,
        link: new URL(link),
      })
    }
  }
  await page.waitForTimeout(500)
  await browser.close()
  return true
}
