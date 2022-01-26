import { useState, useEffect, ChangeEvent } from 'react'
import { supabase } from '@services/supabase'
import { AuthSession } from '@supabase/supabase-js'
import { Profile } from '../../types/Supabase'
import { Avatar } from '@components/Avatar'
import { UploadButton } from '@components/Button'
import { Questions } from '@components/Questions'
import { DEFAULT_AVATARS_BUCKET } from '@constants/SUPABASE'

const Account = ({ session }: { session: AuthSession }): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [cash_address, setCashAddress] = useState<string | null>(null)
  const [cash_balance, setCashBalance] = useState<number | null>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Earráid logáil amach:', error.message)
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length == 0) {
        throw 'Caith tú íomhá a roghnú le huaslódáil.'
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
    setCashAddress(profile.cash_address)
    setCashBalance(profile.cash_balance)
  }

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const { data, error } = await supabase
        .from('profiles')
        .select(`avatar_url, username, cash_address, cash_balance`)
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
      <div>
        <div className="flex flex-wrap">
          <div className="card">
            <div className="card-body">
              <label htmlFor="avatar" className="input-group ">
                <span>Abhatár</span>
                <Avatar url={avatar} size={94} />
              </label>
              <UploadButton onUpload={uploadAvatar} loading={uploading} />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <label htmlFor="email" className="input-group">
                <span className="label-text">Ríomhphost</span>
                <input
                  className="input input-bordered"
                  id="email"
                  type="text"
                  value={session.user?.email}
                  disabled
                />
              </label>
              <label htmlFor="cash_address" className="input-group">
                <span className="label-text">Seoladh 🪙</span>
                <input
                  className="input input-bordered"
                  id="cash_address"
                  type="text"
                  value={cash_address ?? ''}
                  disabled
                />
              </label>
              <label htmlFor="cash_balance" className="input-group">
                <span className="label-text">Iarmhéid 🪙</span>
                <input
                  className="input input-bordered"
                  id="cash_balance"
                  type="text"
                  value={cash_balance ?? ''}
                  disabled
                />
              </label>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <label htmlFor="username" className="input-group">
                <span className="label-text">Ainm</span>
                <input
                  className="input input-bordered"
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <div className="card-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => updateProfile()}
                  disabled={loading}
                >
                  {loading ? 'Ag lódáil ...' : 'Uasdátú'}
                </button>
                <button className="btn btn-secondary" onClick={() => signOut()}>
                  Sínigh Amach
                </button>
              </div>
            </div>
          </div>
        </div>
        {session.user && (
          <div className="card-body">
            <Questions user={session.user} />
          </div>
        )}
      </div>
    )
  )
}
export default Account
