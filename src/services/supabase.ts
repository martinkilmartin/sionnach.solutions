import { createClient } from '@supabase/supabase-js'

import { Headline } from 'src/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const AddHeadline = async (headline: Headline): Promise<void> => {
  const { data: hl, error } = await supabase
    .from('headlines')
    .insert(headline)
    .single()
  if (error) {
    console.error(error)
  } else {
    console.error(hl)
  }
}

export const HeadlineExists = async (
  headlineHash: number
): Promise<boolean> => {
  const { data: hl, error } = await supabase
    .from('headlines')
    .select('id')
    .eq('id', headlineHash)
  if (hl?.length) {
    console.error('supabase found headline hash')
    return true
  } else {
    console.error('supabase did not find headline hash')
    console.error(error)
    return false
  }
}
