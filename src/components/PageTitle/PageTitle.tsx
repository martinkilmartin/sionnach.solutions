type Props = {
  title: string
}

const PageTitle = ({ title }: Props): JSX.Element => {
  return (
    <h1 className="w-full mb-4 text-4xl font-extrabold leading-9 text-center">
      {title}
    </h1>
  )
}

export default PageTitle
