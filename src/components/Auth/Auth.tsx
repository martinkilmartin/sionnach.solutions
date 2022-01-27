import { useState } from 'react'
import { supabase } from '@services/supabase'

const Auth = (): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error: any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card card-bordered">
      <div className="card-body">
        <h1 className="card-title">Spraoi</h1>
        <div className="form-control">
          <p className="label">
            Sínigh isteach trí nasc draíochta chuig do ríomhphost
          </p>
          <input
            className="input"
            type="email"
            placeholder="do@sheoladh.ríomhphost"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="card-actions">
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className="btn btn-primary"
            disabled={loading}
          >
            <span>{loading ? 'Ag lódáil' : 'Seol nasc draíochta'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
export default Auth