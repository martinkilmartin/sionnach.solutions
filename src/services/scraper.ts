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
  try {
    headline = await page.$eval(
      paper.headlinePath,
      (headlineElm: HTMLElement) => headlineElm.innerText
    )
  } catch (err) {
    console.error('❌ Headline not found for ' + paper.id + '!')
  }

  let section = 'news'
  try {
    section = await page.$eval(
      paper.sectionPath,
      (sectionElm: HTMLElement) => sectionElm.innerText
    )
  } catch (err) {
    console.error('❌ Category not found for ' + paper.id + '!')
  }

  let link = ''
  try {
    link = await page.$eval(
      paper.linkPath,
      (urlElm: HTMLAnchorElement) => urlElm.href
    )
  } catch (err) {
    console.error('❌ Link not found for ' + paper.id + '!')
  }

  if (headline.length) {
    const hashedLine = hashCode(paper.id + headline)
    console.error(`${hashedLine} ${headline} ` + paper.id + '!')
    const exists = await HeadlineExists(hashedLine)
    if (!exists) {
      console.error('✔ New headline found for ' + paper.id + '!')
      await AddHeadline({
        id: hashedLine,
        source: paper.id,
        section: section,
        headline: headline,
        link: new URL(link),
      })
    } else {
      console.error('♻ No news is good news for ' + paper.id + '!')
    }
  } else {
    console.error('⭕ No headline found for ' + paper.id + '!')
  }
  await page.waitForTimeout(500)
  await browser.close()
  return true
}
