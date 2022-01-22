import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '@services/supabase'
import { AuthSession } from '@supabase/supabase-js'
import { Profile } from '../../types/Supabase'
import { Avatar } from '@components/Avatar'
import { UploadButton } from '@components/Button'
import { DEFAULT_AVATARS_BUCKET } from '@constants/SUPABASE'

const Account = ({ session }: { session: AuthSession }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [website, setWebsite] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length == 0) {
        throw 'You must select an image to upload.'
      }

      const user = supabase.auth.user()
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${session?.user?.id}${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(DEFAULT_AVATARS_BUCKET)
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { error: updateError } = await supabase.from('profiles').upsert({
        id: user?.id,
        avatar_url: filePath,
      })

      if (updateError) {
        throw updateError
      }

      setAvatar(null)
      setAvatar(filePath)
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  function setProfile(profile: Profile) {
    setAvatar(profile.avatar_url)
    setUsername(profile.username)
    setWebsite(profile.website)
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
    } catch (error: any) {
      console.error('error', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user?.id,
        username,
        website,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    session && (
      <div className="card card-bordered">
        <div className="card-body form-control">
          <div className="input-group">
            <label htmlFor="avatar" className="label">
              <span className="label-text">Avatar</span>
            </label>
            <div className="avatarField">
              <Avatar url={avatar} size={94} />
              <UploadButton onUpload={uploadAvatar} loading={uploading} />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              className="input input-bordered"
              id="email"
              type="text"
              value={session.user?.email}
              disabled
            />
          </div>
          <div className="input-group">
            <label htmlFor="username" className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              className="input input-bordered"
              id="username"
              type="text"
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="website" className="label">
              <span className="label-text">Website</span>
            </label>
            <input
              className="input input-bordered"
              id="website"
              type="website"
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <button
              className="btn primary"
              onClick={() => updateProfile()}
              disabled={loading}
            >
              {loading ? 'Loading ...' : 'Update'}
            </button>
          </div>

          <div>
            <button className="btn secondary" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  )
}
export default Account
