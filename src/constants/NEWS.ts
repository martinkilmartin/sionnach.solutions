import { NewsSource } from 'src/types/NewsSource'

export const News: NewsSource[] = [
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
