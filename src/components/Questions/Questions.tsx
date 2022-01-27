import { useState, useEffect } from 'react'
import { supabase } from '@services/supabase'
import { User, Question as QuestionType } from 'src/types'

type QuestionsProps = {
  user: User
}
type QuestionProps = {
  question: QuestionType
  onDelete: () => void
}
const Questions = ({ user }: QuestionsProps): JSX.Element => {
  const [questions, setQuestions] = useState<QuestionType[] | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [newClue, setNewClue] = useState('')
  const [tag, setTag] = useState('')
  const [errorText, setError] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('id', { ascending: true })
    if (error) console.error('error', error)
    else setQuestions(questions)
  }

  const addQuestion = async (q: string, a: string, c: string, t: string) => {
    const question = q.trim()
    const answer = a.trim()
    const clue = c.trim()
    const tag = t.trim()
    if (question.length && answer.length) {
      setError('')
      const { data: questionBack, error } = await supabase
        .from('questions')
        .insert({ question, answer, clue, tag, user_id: user.id })
        .single()
      if (error) setError(error.message)
      else if (Array.isArray(questions)) {
        setQuestions([...questions, questionBack])
        clear()
      }
    } else {
      setError(question.length ? 'Freagra ag teastáil' : 'Ceist ag teastáil')
    }
  }

  const clear = () => {
    setNewQuestion('')
    setNewAnswer('')
    setNewClue('')
    setTag('')
  }

  const deleteQuestion = async (id: number) => {
    try {
      await supabase.from('questions').delete().eq('id', id)
      if (questions) setQuestions(questions.filter((x) => x.id != id))
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-center text-2xl">Ceisteanna</h2>
      <div className="flex flex-wrap gap-2 my-2">
        <div className="form-control w-full">
          <label className="input-group">
            <span>Ceist</span>
            <input
              className="rounded w-full p-2 input input-bordered"
              type="text"
              placeholder="Cé leis thú?"
              value={newQuestion}
              onChange={(e) => {
                setNewQuestion(e.target.value)
              }}
            />
          </label>
        </div>
        <div className="form-control w-full">
          <label className="input-group">
            <span>Freagra</span>
            <input
              className="rounded w-full p-2 input input-bordered"
              type="text"
              placeholder="Liom fhéin."
              value={newAnswer}
              onChange={(e) => {
                setNewAnswer(e.target.value)
              }}
            />
          </label>
        </div>
        <div className="form-control w-full">
          <label className="input-group">
            <span>Cliú</span>
            <input
              className="rounded w-full p-2 input input-bordered"
              type="text"
              placeholder="42"
              value={newClue}
              onChange={(e) => {
                setNewClue(e.target.value)
              }}
            />
          </label>
        </div>
        <div className="form-control w-full">
          <label className="input-group">
            <span>Clib</span>
            <input
              className="rounded p-2 w-full input input-bordered"
              type="text"
              placeholder="#"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value)
              }}
            />
          </label>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => addQuestion(newQuestion, newAnswer, newClue, tag)}
        >
          Cuir le
        </button>
      </div>
      {errorText && <Alert text={errorText} />}
      <div className="shadow overflow-hidden rounded-md">
        <ul>
          {questions?.length &&
            questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                onDelete={() => deleteQuestion(question.id)}
              />
            ))}
        </ul>
      </div>
    </div>
  )
}

const Question = ({ question, onDelete }: QuestionProps) => {
  const [isAnswered, setIsCompleted] = useState(question.is_answered)

  const toggle = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({ is_answered: !isAnswered })
        .eq('id', question.id)
        .single()
      if (error) {
        throw new Error(error.message)
      }
      setIsCompleted(data.is_answered)
    } catch (error) {
      console.error('error', error)
    }
  }

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div>
          <input
            className="cursor-pointer mr-4"
            onChange={(_e) => toggle()}
            type="checkbox"
            checked={isAnswered ? true : false}
          />
        </div>
        <div className="min-w-0 flex-1 flex items-center">
          {question?.tag?.length && (
            <div className="badge badge-info mr-2">{question.tag}</div>
          )}
          <div className="text-sm leading-5 font-medium truncate">
            <details>
              <summary>{question.question}</summary>
              {question.answer}
            </details>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="ml-2"
        >
          ❌
        </button>
      </div>
    </li>
  )
}

const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)

export default Questions
