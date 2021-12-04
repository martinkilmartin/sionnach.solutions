import { createClient } from '@supabase/supabase-js'

import { Headline } from 'src/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

export const AddHeadline = async (headline: Headline): Promise<boolean> => {
  const { data: hl, error } = await supabase
    .from('headlines')
    .insert(headline)
    .single()
  if (error) console.error(error)
  return hl?.length ? true : false
}

export const HeadlineExists = async (
  headlineHash: number
): Promise<boolean> => {
  const { data: hl, error } = await supabase
    .from('headlines')
    .select('id')
    .eq('id', headlineHash)
  if (error) console.error(error)
  return hl?.length ? true : false
}
