export type NewsSource = {
  id: 'IE_EXAM' | 'IE_INDO' | 'IE_TIME' | 'IE_TRSC'
  url:
    | 'https://www.irishexaminer.com/'
    | 'https://www.independent.ie/'
    | 'https://www.irishtimes.com/'
    | 'https://tuairisc.ie/'
  headlinePath: string
  sectionPath: string
  linkPath: string
}
