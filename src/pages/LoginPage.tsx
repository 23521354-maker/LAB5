import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginAsync } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector((s)=> s.auth)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    if(auth?.token) navigate('/dashboard')
  },[auth?.token, navigate])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if(!email.includes('@')) return setError('Please enter a valid email')
    if(password.length < 6) return setError('Password must be at least 6 characters')

    try{
      // dispatch login async (handle both RTK thunk promise and test mocks)
      const actionResult: any = await dispatch(loginAsync({ email, password }))
      let res: any
      if(actionResult && typeof actionResult.unwrap === 'function'){
        res = await actionResult.unwrap()
      }else if(actionResult && actionResult.payload){
        res = actionResult.payload
      }else{
        res = actionResult
      }

      if(res && res.token){
        navigate('/dashboard')
      }
    }catch(err:any){
      setError(err?.message || String(err) || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-2 gap-6 shadow-lg rounded overflow-hidden">
        <div className="p-8 bg-[var(--sidebar-bg)] text-white flex flex-col justify-center">
          <h1 className="text-3xl font-bold">NexSales Enterprise</h1>
          <p className="mt-3 opacity-80">Modern admin tools for inventory & sales intelligence.</p>
        </div>
        <div className="p-8 bg-white flex items-center">
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
            <p className="text-sm text-slate-600 mb-6">Enter your corporate credentials to continue.</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">Email</label>
                <input id="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm mb-1">Password</label>
                <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              {auth?.error && <div className="text-sm text-red-600">{String(auth.error)}</div>}

              <div>
                <button disabled={auth?.loading} className="w-full bg-[var(--accent)] text-white py-2 rounded">
                  {auth?.loading ? 'Signing in…' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
