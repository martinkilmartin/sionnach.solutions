import playwright from 'playwright'

const PAPERS = [
  {
    id: 'IE_EXAM',
    url: 'https://www.irishexaminer.com/',
    headlinePath: 'h5.card-title',
    sectionPath: 'p.label-small-category',
    linkPath: 'article.card a',
  },
  {
    id: 'IE_INDO',
    url: 'https://www.independent.ie/',
    headlinePath: '.title2',
    sectionPath: '.section1-main',
    linkPath: '.c-card1-textlink',
  },
  {
    id: 'IE_TIME',
    url: 'https://www.irishtimes.com/',
    headlinePath: 'span.h2',
    sectionPath: '',
    linkPath: '//a[@data-evt-category="Top spot element"]',
  },
  // {
  //   id: 'IE_TRSC',
  //   url: 'https://tuairisc.ie/',
  //   headlinePath: 'h1.title.article--lead__title',
  //   sectionPath: '',
  //   linkPath: 'a.article--lead__link',
  // },
]

const hashCode = (s) =>
  s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

const HEADLINES = {}

async function main() {
  PAPERS.forEach((paper) => {
    scrape(paper)
  })
  console.error('🔰')
  console.error(HEADLINES)
}

async function scrape(paper) {
  console.error(`🔪 ScRaPiNg  . . . ${Date.now()}`)
  const browser = await playwright.chromium.launch({
    headless: true, // set this to true
  })

  const page = await browser.newPage()

  await page.setDefaultNavigationTimeout(0);

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
      (headlineElm) => headlineElm.innerText
    )
  } catch (err) {
    console.error('❌ No headline found for ' + paper.id + '!')
  }

  let section = 'news'
  try {
    section = await page.$eval(
      paper.sectionPath,
      (sectionElm) => sectionElm.innerText
    )
  } catch (err) {
    console.error('❌ No section found for ' + paper.id + '!')
  }

  let link = ''
  try {
    link = await page.$eval(paper.linkPath, (urlElm) => urlElm.href)
  } catch (err) {
    console.error('❌ No link found for ' + paper.id + '!')
  }

  if (headline.length) {
    const hashedLine = hashCode(paper.id + headline)
    if (!HEADLINES[hashedLine]) {
      console.error('✔ New headline found for ' + paper.id + '!')
      HEADLINES[hashedLine] = {
        time: Date.now(),
        source: paper.id,
        section: section,
        headline: headline,
        link: link,
      }
    } else {
      console.error('♻ No news is good news for ' + paper.id + '!')
    }
  } else {
    console.error('⭕ No headline found for ' + paper.id + '!')
  }
  await page.waitForTimeout(500) // wait
  await browser.close()
}

main()

setInterval(function () {
  main()
}, 9988)
