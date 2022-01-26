import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@services/supabase'
import { DEFAULT_AVATARS_BUCKET } from '@constants/SUPABASE'

const Avatar = ({
  url,
  size,
}: {
  url: string | null
  size: number
}): JSX.Element => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(DEFAULT_AVATARS_BUCKET)
        .download(path)
      if (error) {
        throw error
      }
      if (data) {
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      }
    } catch (error: any) {
      console.error('Earráid ag íoslódáil an íomhá: ', error.message)
    }
  }

  return (
    <div className="avatar">
      <div className="mb-8 w-24 h-24 mask mask-squircle">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            className="avatar"
            height={size}
            width={size}
            alt="Abhatár"
          />
        ) : (
          <div className="avatar text-6xl mt-4 ml-4">🤠</div>
        )}
      </div>
    </div>
  )
}

export default Avatar
