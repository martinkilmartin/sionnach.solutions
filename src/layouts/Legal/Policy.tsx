import { MainContent } from '@layouts/MainContent'
import { DescriptionCard } from '.'

type Props = {
  title: string
  paragraphs: {
    title?: string
    subTitle?: string
    content?: string[]
    table?: {
      title: string
      name: string
      purpose: string
    }[]
  }[]
}

const Policy = ({ title, paragraphs }: Props): JSX.Element => (
  <MainContent title={title}>
    <div className="flex flex-col mx-auto">
      <dl className="w-full">
        {paragraphs.map((paragraph, i) => (
          <div key={i}>
            {paragraph.title && (
              <dt className="mb-4">
                <h3 className="text-xl font-semibold text-center">
                  {paragraph.title}
                </h3>
              </dt>
            )}
            {paragraph.subTitle && (
              <dt className="mb-3">
                <h4 className="text-lg font-semibold text-center">
                  {paragraph.subTitle}
                </h4>
              </dt>
            )}
            {paragraph.content &&
              paragraph.content.map((line, j) => (
                <dd key={j} className="mb-16">
                  <p>{line}</p>
                </dd>
              ))}
            {paragraph.table &&
              paragraph.table.map((description, j) => (
                <DescriptionCard
                  key={j}
                  title={description.title}
                  subtitle={description.name}
                  content={description.purpose}
                />
              ))}
          </div>
        ))}
      </dl>
    </div>
  </MainContent>
)

export default Policy
