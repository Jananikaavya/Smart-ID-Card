import React, {useState} from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom'

function genIdFromInputs(role, password, email){
  const prefix = role === 'student' ? 'STD' : 'EMP'
  // Build a deterministic numeric suffix from password first 3 chars and email local-part first 3 chars
  const pw = (password || '').slice(0,3).padEnd(3,'0')
  const emailLocal = (email||'').split('@')[0].slice(0,3).padEnd(3,'x')

  // convert chars to digits: if char is digit keep, else use charCode % 10
  const mapToDigits = s => s.split('').map(ch => {
    if(/\d/.test(ch)) return ch
    return String(ch.charCodeAt(0) % 10)
  }).join('').slice(0,3)

  const pPart = mapToDigits(pw)
  const ePart = mapToDigits(emailLocal)
  return `${prefix}-${pPart}${ePart}`
}

function readUsers(){
  try{ return JSON.parse(localStorage.getItem('smartid_users')||'[]') }catch{ return [] }
}

function saveUser(user){
  const users = readUsers()
  users.push(user)
  localStorage.setItem('smartid_users', JSON.stringify(users))
}

export default function Register(){
  const [form, setForm] = useState({name:'', email:'', role:'employee', password:''})
  const [errors, setErrors] = useState({})
  const [assigned, setAssigned] = useState(null)
  const navigate = useNavigate()

  function handleChange(e){
    const {name, value} = e.target
    setForm(prev=>({...prev, [name]: value}))
    setErrors(prev=>({ ...prev, [name]: '' }))
  }

  function validate(){
    const err = {}
    if(!form.name.trim()) err.name = 'Name is required'
    if(!form.email.trim()) err.email = 'Email is required'
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Enter a valid email'
    if(!form.password || form.password.length < 6) err.password = 'Password must be 6+ chars'
    return err
  }

  function makeUniqueId(role, password, email){
    const users = readUsers()
    let id = genIdFromInputs(role, password, email)
    let counter = 0
    // if collision, append a small counter to the end until unique
    while(users.some(u=>u.assignedId === id) && counter < 1000){
      counter++
      id = `${id.split('-')[0]}-${id.split('-')[1]}${String(counter).padStart(2,'0')}`
    }
    return id
  }

  function handleSubmit(e){
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if(Object.keys(v).length>0) return

    const assignedId = makeUniqueId(form.role, form.password, form.email)
    // Save password here for demo/admin purposes (not secure). In production hash and store on server.
    const user = { name: form.name, email: form.email, role: form.role, assignedId, password: form.password, createdAt: Date.now() }
    saveUser(user)
    // set assigned so the user sees their assigned ID and can copy/download it
    setAssigned(user)
  }

  return (
    <div className="register-wrapper">
      <div className="register-card glass-card">
        <h3>Create Account</h3>
        {!assigned && (
          <form onSubmit={handleSubmit} className="register-form" noValidate>
            <label>
              <span className="label-text">Full name</span>
              <input name="name" value={form.name} onChange={handleChange} />
              {errors.name && <div className="error">{errors.name}</div>}
            </label>

            <label>
              <span className="label-text">Email</span>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <div className="error">{errors.email}</div>}
            </label>

            <label>
              <span className="label-text">Role</span>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="student">Student</option>
              </select>
            </label>

            <label>
              <span className="label-text">Password</span>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <div className="error">{errors.password}</div>}
            </label>

            <div className="reg-actions">
              <button className="primary" type="submit">Create account</button>
              <button type="button" className="secondary" onClick={()=>navigate('/login')}>Back to login</button>
            </div>
          </form>
        )}

        {assigned && (
          <div className="assigned">
            <h4>Registration complete</h4>
            <p>Please copy or download your assigned ID and store it securely. You will need this to login.</p>
            <p>Assigned ID for <strong>{assigned.name}</strong>:</p>
            <div className="assigned-id">{assigned.assignedId}</div>
            <p className="muted">Role: {assigned.role}</p>
            <div className="reg-actions">
              <button className="primary" onClick={()=>{ navigator.clipboard?.writeText(assigned.assignedId); alert('Copied to clipboard') }}>Copy ID</button>
              <button className="primary" onClick={()=>{
                const content = `Assigned ID: ${assigned.assignedId}\nName: ${assigned.name}\nEmail: ${assigned.email}\nRole: ${assigned.role}`
                const blob = new Blob([content], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${assigned.assignedId}.txt`
                document.body.appendChild(a)
                a.click()
                a.remove()
                URL.revokeObjectURL(url)
              }}>Download ID</button>
              <button className="secondary" onClick={()=>navigate('/login')}>Proceed to Login</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
