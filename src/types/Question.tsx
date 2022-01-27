export type Question = {
  id: number
  user_id: string
  question: string
  answer: string
  clue?: string
  is_answered: boolean
  inserted_at: number
}
