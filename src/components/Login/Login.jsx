import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login({ onLogin }){
  const [form, setForm] = useState({ nameId:'', email:'', password:'', remember:false })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [showForgot, setShowForgot] = useState(false)
  const [forgotId, setForgotId] = useState('')
  const [resetStep, setResetStep] = useState(0) // 0=enter id,1=set new pw,2=done
  const [foundUser, setFoundUser] = useState(null)
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')


  function handleChange(e){
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function validate(){
    const errs = {}
    if(!form.nameId.trim()) errs.nameId = 'Full name or ID is required.'
    if(!form.email.trim()) errs.email = 'Email is required.'
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if(!form.password) errs.password = 'Password is required.'
    else if(form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    return errs
  }

  function handleSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if(Object.keys(v).length === 0){
      // Attempt login against localStorage users (demo admin mode)
      const users = JSON.parse(localStorage.getItem('smartid_users') || '[]')
      // Match by email/password, or by assignedId (entered in nameId) + password
      let user = users.find(u => (u.email === form.email && u.password === form.password))
      if(!user && form.nameId){
        user = users.find(u => (u.assignedId === form.nameId || u.name === form.nameId) && u.password === form.password)
      }

      // admin backdoor: if email matches admin and password matches hardcoded admin pass
      const isAdmin = (form.email === 'admin@smartid.local' && form.password === 'admin123')
      if(isAdmin){
        const admin = { name: 'Administrator', email: form.email, role: 'admin', assignedId: 'ADM-000000' }
        localStorage.setItem('smartid_current', JSON.stringify(admin))
        navigate('/admin')
        return
      }

      if(user){
        // block revoked accounts
        if(user.status === 'revoked'){
          setErrors({ form: 'This account has been revoked. Contact an administrator.' })
          return
        }
        // store session (demo)
        const safe = { name: user.name, email: user.email, role: user.role, assignedId: user.assignedId }
        localStorage.setItem('smartid_current', JSON.stringify(safe))
        navigate('/dashboard')
        return
      }

      setErrors({ form: 'Invalid credentials. Make sure email/ID and password are correct.' })
    }
  }

  function findUserByIdentifier(id){
    const users = JSON.parse(localStorage.getItem('smartid_users') || '[]')
    return users.find(u => u.email === id || u.assignedId === id || u.name === id)
  }

  function handleForgotLookup(e){
    e.preventDefault()
    setErrors({})
    if(!forgotId.trim()) return setErrors({forgot: 'Enter email, name or ID to continue.'})
    const u = findUserByIdentifier(forgotId.trim())
    if(!u) return setErrors({forgot: 'No user found with that email/ID/name.'})
    setFoundUser(u)
    setResetStep(1)
  }

  function handleResetSubmit(e){
    e.preventDefault()
    setErrors({})
    if(newPw.length < 6) return setErrors({reset: 'Password must be at least 6 characters.'})
    if(newPw !== confirmPw) return setErrors({reset: 'Passwords do not match.'})
    // update stored user password
    const users = JSON.parse(localStorage.getItem('smartid_users') || '[]')
    const idx = users.findIndex(u => u.assignedId === foundUser.assignedId)
    if(idx === -1) return setErrors({reset: 'Unable to update password.'})
    users[idx].password = newPw
    localStorage.setItem('smartid_users', JSON.stringify(users))
    setResetStep(2)
  }

  return (
    <div className="login-wrapper">
      <div className="login-card glass-card">
        <div className="login-grid">
          <div className="login-form">
            <div className="login-brand">
              <div className="brand-logo" aria-hidden>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.1" fill="rgba(0,234,255,0.06)"/><path d="M16 8h4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="0.9" fill="rgba(0,234,255,0.08)"/></svg>
              </div>
              <div>
                <div className="brand-title">Smart ID Card System</div>
                <div className="brand-sub">Secure access portal</div>
              </div>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <label className="field">
                <span className="label-text">Full Name / Employee ID</span>
                <input name="nameId" value={form.nameId} onChange={handleChange} className={errors.nameId ? 'invalid' : ''} placeholder="Jane Doe / EMP-01234" autoComplete="name" aria-invalid={!!errors.nameId} />
                {errors.nameId && <div className="error">{errors.nameId}</div>}
              </label>

              <label className="field">
                <span className="label-text">Email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} className={errors.email ? 'invalid' : ''} placeholder="you@agency.gov" autoComplete="email" aria-invalid={!!errors.email} />
                {errors.email && <div className="error">{errors.email}</div>}
              </label>

              <label className="field">
                <span className="label-text">Password</span>
                <div className="password-row">
                  <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className={errors.password ? 'invalid' : ''} placeholder="••••••••" autoComplete="current-password" aria-invalid={!!errors.password} />
                  <button type="button" className="show-btn" onClick={()=>setShowPassword(s=>!s)} aria-label={showPassword? 'Hide password':'Show password'}>{showPassword? 'Hide':'Show'}</button>
                </div>
                {errors.password && <div className="error">{errors.password}</div>}
              </label>

              <label className="remember">
                <input name="remember" type="checkbox" checked={form.remember} onChange={handleChange} />
                <span>Remember me</span>
              </label>

              <div className="actions">
                <button className="primary" type="submit">Login</button>
                <div style={{display:'flex',flexDirection:'column',gap:6}}>
                  <button type="button" className="forgot" onClick={()=>{ setShowForgot(true); setResetStep(0); setFoundUser(null); setForgotId('') }}>Forgot password?</button>
                  <Link to="/register" className="forgot">Create an account</Link>
                </div>
              </div>
            </form>
          </div>

          <aside className="login-illustration" aria-hidden>
            <div className="illus-inner">
              <div className="chip" />
              <div className="lock" />
              <p>Secure identity verification</p>
            </div>
          </aside>
        </div>
      </div>
      {/* Forgot password modal/inline */}
      {showForgot && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:90}}>
          <div style={{width:420,maxWidth:'94%',padding:18,background:'rgba(10,12,18,0.9)',borderRadius:12,border:'1px solid rgba(255,255,255,0.04)'}}>
            <h4 style={{color:'var(--heading)'}}>Forgot password</h4>
            {resetStep === 0 && (
              <form onSubmit={handleForgotLookup}>
                <p className="muted">Enter your registered email, name or assigned ID. We will let you reset your password if the account exists (demo).</p>
                <input value={forgotId} onChange={e=>setForgotId(e.target.value)} placeholder="email or ID or name" style={{width:'100%',padding:10,borderRadius:8,marginTop:8}} />
                {errors.forgot && <div className="error">{errors.forgot}</div>}
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="primary" type="submit">Lookup</button>
                  <button className="secondary" type="button" onClick={()=>setShowForgot(false)}>Cancel</button>
                </div>
              </form>
            )}

            {resetStep === 1 && foundUser && (
              <form onSubmit={handleResetSubmit}>
                <p className="muted">Reset password for <strong>{foundUser.name}</strong> ({foundUser.assignedId})</p>
                <input value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="New password" type="password" style={{width:'100%',padding:10,borderRadius:8,marginTop:8}} />
                <input value={confirmPw} onChange={e=>setConfirmPw(e.target.value)} placeholder="Confirm password" type="password" style={{width:'100%',padding:10,borderRadius:8,marginTop:8}} />
                {errors.reset && <div className="error">{errors.reset}</div>}
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="primary" type="submit">Set password</button>
                  <button className="secondary" type="button" onClick={()=>{ setShowForgot(false); setResetStep(0); setFoundUser(null) }}>Close</button>
                </div>
              </form>
            )}

            {resetStep === 2 && (
              <div>
                <p className="muted">Password updated successfully. Use your email or assigned ID with the new password to login.</p>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="primary" onClick={()=>{ setShowForgot(false); navigate('/login') }}>Go to Login</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
