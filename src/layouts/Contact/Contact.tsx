import { MainContent } from '@layouts/MainContent'
import { useState, FormEvent } from 'react'

import {
  CONTACT_TITLE,
  CONTACT_SUCCESS,
  CONTACT_FAILURE,
} from '@constants/CONTENT'
import { Alert } from '@components/Alert'
import { TextArea, TextInput } from '@components/Form'
import { Button } from '@components/Button'

type Props = {
  messageTitle: string
  messagePlaceholder: string
  contactTitle: string
  contactPlaceholder: string
  buttonText: string
}

const Contact = ({
  messageTitle,
  messagePlaceholder,
  contactTitle,
  contactPlaceholder,
  buttonText,
}: Props): JSX.Element => {
  const [result, setResult] = useState()
  const [error, setError] = useState()
  async function formSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const htmlForm = event.target as HTMLFormElement
    const res = await fetch('/api/contact', {
      body: JSON.stringify({
        email: htmlForm.email.value,
        message: htmlForm.message.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    const { result, error } = await res.json()
    if (result) {
      setResult(result)
      setError(undefined)
    }
    if (error) {
      setResult(undefined)
      setError(error)
    }
  }
  return (
    <MainContent title={CONTACT_TITLE}>
      <div className="justify-center max-w-full shadow-2xl card bg-base-100 hero-content">
        {result && <Alert color="success" text={CONTACT_SUCCESS} />}
        {error && <Alert color="error" text={CONTACT_FAILURE} />}
        <div className="card-body">
          <form onSubmit={formSubmit}>
            <TextArea
              title={messageTitle}
              placeholder={messagePlaceholder}
              name="message"
              id="message"
            />
            <TextInput
              title={contactTitle}
              placeholder={contactPlaceholder}
              type="email"
              name="email"
              id="email"
            />
            <div className="mt-6 form-control">
              <Button text={buttonText} />
            </div>
          </form>
        </div>
      </div>
    </MainContent>
  )
}

export default Contact
