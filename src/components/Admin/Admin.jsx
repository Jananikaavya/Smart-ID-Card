import React, { useEffect, useState } from 'react'
import './Admin.css'

function readUsers(){
  try{ return JSON.parse(localStorage.getItem('smartid_users') || '[]') }catch{ return [] }
}

function writeUsers(users){
  localStorage.setItem('smartid_users', JSON.stringify(users))
}

function readAudit(){
  try{ return JSON.parse(localStorage.getItem('smartid_audit') || '[]') }catch{ return [] }
}

function pushAudit(entry){
  const logs = readAudit()
  logs.unshift(entry)
  localStorage.setItem('smartid_audit', JSON.stringify(logs))
}

function genIdFromInputs(role, password, email){
  const prefix = role === 'student' ? 'STD' : 'EMP'
  const pw = (password || '').slice(0,3).padEnd(3,'0')
  const emailLocal = (email||'').split('@')[0].slice(0,3).padEnd(3,'x')
  const mapToDigits = s => s.split('').map(ch => {
    if(/\d/.test(ch)) return ch
    return String(ch.charCodeAt(0) % 10)
  }).join('').slice(0,3)
  const pPart = mapToDigits(pw)
  const ePart = mapToDigits(emailLocal)
  return `${prefix}-${pPart}${ePart}`
}

export default function Admin(){
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')
  const [tab, setTab] = useState('users')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({name:'',email:'',role:'employee',password:''})
  const [audit, setAudit] = useState([])

  useEffect(()=>{
    setUsers(readUsers())
    setAudit(readAudit())
  }, [])

  function refresh(){
    setUsers(readUsers())
    setAudit(readAudit())
  }

  function removeUser(id){
    const remaining = users.filter(u=>u.assignedId !== id)
    writeUsers(remaining)
    pushAudit({ action:'remove', id, actor:'admin', at:Date.now() })
    refresh()
  }

  function toggleRevoke(u){
    const updated = users.map(x => x.assignedId === u.assignedId ? {...x, status: x.status === 'revoked' ? 'active' : 'revoked'} : x)
    writeUsers(updated)
    pushAudit({ action: updated.find(x=>x.assignedId===u.assignedId).status === 'revoked' ? 'revoke' : 'restore', id:u.assignedId, actor:'admin', at:Date.now() })
    refresh()
  }

  function handleAddSubmit(e){
    e.preventDefault()
    // generate id
    const assignedId = genIdFromInputs(form.role, form.password, form.email)
    const usersNow = readUsers()
    let id = assignedId
    let cnt = 0
    while(usersNow.some(x=>x.assignedId === id) && cnt<1000){ cnt++; id = `${assignedId}${String(cnt).padStart(2,'0')}` }
    const user = { name: form.name, email: form.email, role: form.role, assignedId: id, password: form.password, status:'active', createdAt: Date.now() }
    usersNow.unshift(user)
    writeUsers(usersNow)
    pushAudit({ action:'create', id: id, actor:'admin', at:Date.now(), by: 'admin' })
    setShowAdd(false)
    setForm({name:'',email:'',role:'employee',password:''})
    refresh()
  }

  function exportUsers(){
    const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `smartid_users_export.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    pushAudit({ action:'export', actor:'admin', at:Date.now() })
  }

  const shown = users.filter(u => {
    if(!filter) return true
    const q = filter.toLowerCase()
    return (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q) || (u.assignedId||'').toLowerCase().includes(q) || (u.role||'').toLowerCase().includes(q)
  })

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h2 style={{color:'var(--heading)',margin:0}}>Admin Console</h2>
          <div className="muted" style={{marginTop:6}}>Manage users, issue/revoke IDs and view audit logs.</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={()=>setTab('users')}>Users</button>
          <button className="btn" onClick={()=>setTab('audit')}>Audit</button>
          <button className="btn" onClick={exportUsers}>Export</button>
          <button className="btn" onClick={()=>setShowAdd(true)}>Add user</button>
        </div>
      </div>

      {tab === 'users' && (
        <div style={{marginTop:16}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input placeholder="Search name, email, id or role" value={filter} onChange={e=>setFilter(e.target.value)} style={{flex:1,padding:10,borderRadius:8}} />
            <div className="muted">Total: {users.length}</div>
          </div>

          <div className="user-list" style={{marginTop:12}}>
            {shown.map(u => (
              <div className="user-row glass-card" key={u.assignedId}>
                <div>
                  <div className="u-name">{u.name} <span className="u-role">{u.role}</span></div>
                  <div className="u-meta">{u.email} • <strong>{u.assignedId}</strong> • <span className="muted">{u.status||'active'}</span></div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn" onClick={()=>navigator.clipboard?.writeText(u.assignedId)}>Copy ID</button>
                  <button className="btn" onClick={()=>{ toggleRevoke(u) }}>{u.status === 'revoked' ? 'Restore' : 'Revoke'}</button>
                  <button className="btn danger" onClick={()=>removeUser(u.assignedId)}>Delete</button>
                </div>
              </div>
            ))}
            {shown.length === 0 && <div className="muted" style={{marginTop:12}}>No users found.</div>}
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div style={{marginTop:12}}>
          <div className="muted">Recent actions</div>
          <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:10}}>
            {audit.map((a,i) => (
              <div key={i} className="glass-card" style={{padding:10}}>
                <div style={{fontSize:13}}><strong>{a.action}</strong> — <span className="muted">{a.id || ''}</span></div>
                <div className="muted" style={{marginTop:6,fontSize:13}}>By: {a.actor} • {new Date(a.at).toLocaleString()}</div>
              </div>
            ))}
            {audit.length === 0 && <div className="muted">No audit logs yet.</div>}
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:120}}>
          <div style={{width:520,maxWidth:'94%',padding:18,background:'var(--card)',borderRadius:12}}>
            <h3 style={{marginTop:0}}>Add new user</h3>
            <form onSubmit={handleAddSubmit}>
              <label className="label-text">Full name</label>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{width:'100%',padding:10,borderRadius:8}} />
              <label className="label-text">Email</label>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} style={{width:'100%',padding:10,borderRadius:8}} />
              <label className="label-text">Role</label>
              <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{width:'100%',padding:10,borderRadius:8}}>
                <option value="employee">Employee</option>
                <option value="student">Student</option>
              </select>
              <label className="label-text">Password</label>
              <input value={form.password} onChange={e=>setForm({...form,password:e.target.value})} type="password" style={{width:'100%',padding:10,borderRadius:8}} />
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <button className="btn" type="submit">Create</button>
                <button className="btn" type="button" onClick={()=>setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
