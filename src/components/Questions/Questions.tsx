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
  const [newQuestionText, setNewQuestionText] = useState('')
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
  const addQuestion = async (questionText: string) => {
    const question = questionText.trim()
    const answer = 'static answer'
    if (question.length) {
      const { data: questionBack, error } = await supabase
        .from('questions')
        .insert({ question, answer, user_id: user.id })
        .single()
      if (error) setError(error.message)
      else if (Array.isArray(questions))
        setQuestions([...questions, questionBack])
    }
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
    <div className="w-full">
      <h1 className="mb-12">Question List.</h1>
      <div className="flex gap-2 my-2">
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="make coffee"
          value={newQuestionText}
          onChange={(e) => {
            setError('')
            setNewQuestionText(e.target.value)
          }}
        />
        <button
          className="btn-black"
          onClick={() => addQuestion(newQuestionText)}
        >
          Add
        </button>
      </div>
      {!!errorText && <Alert text={errorText} />}
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
    <li
      onClick={(e) => {
        e.preventDefault()
        toggle()
      }}
      className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out"
    >
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <div className="text-sm leading-5 font-medium truncate">
            {question.question}
          </div>
        </div>
        <div>
          <input
            className="cursor-pointer"
            onChange={(_e) => toggle()}
            type="checkbox"
            checked={isAnswered ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
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
