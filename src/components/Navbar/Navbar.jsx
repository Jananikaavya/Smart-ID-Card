import React, {useState, useEffect} from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    try{ const c = JSON.parse(localStorage.getItem('smartid_current') || 'null'); setCurrent(c) }catch{ setCurrent(null) }
  },[])

  function linkClass({ isActive }){
    return 'nav-link' + (isActive ? ' active' : '')
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <NavLink className="logo" to="/" aria-label="Smart ID System" onClick={()=>setOpen(false)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" fill="rgba(0,234,255,0.06)" />
              <path d="M17 8h2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 12h2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 10h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1" fill="rgba(0,234,255,0.08)" />
            </svg>
            <span className="logo-text">Smart ID System</span>
          </NavLink>
        </div>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary">
          <NavLink to="/" className={linkClass} onClick={()=>setOpen(false)}>
            <span className="icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Home</span>
          </NavLink>
          <NavLink to="/generate" className={linkClass} onClick={()=>setOpen(false)}>
            <span className="icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M8 8h5M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Generate ID</span>
          </NavLink>
          <NavLink to="/verify" className={linkClass} onClick={()=>setOpen(false)}>
            <span className="icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Verify </span>
          </NavLink>
          <NavLink to="/dashboard" className={linkClass} onClick={()=>setOpen(false)}>
            <span className="icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M7 21V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 21V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Dashboard</span>
          </NavLink>
          <NavLink to="/support" className={linkClass} onClick={()=>setOpen(false)}>
            <span className="icon" aria-hidden>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span className="label">Support</span>
          </NavLink>
        </nav>

        <div className="nav-actions">
          {!current ? (
            <NavLink to="/login" className={({isActive})=> isActive? 'login-btn active' : 'login-btn'} onClick={()=>setOpen(false)}>Login</NavLink>
          ) : (
            <>
              <button className="login-btn" onClick={()=>{ localStorage.removeItem('smartid_current'); setCurrent(null); navigate('/login') }}>Logout</button>
              <div className="avatar" title={current?.name || 'Profile'} aria-hidden>{(current?.name||'').slice(0,1).toUpperCase()}</div>
            </>
          )}
          <button className={`hamburger ${open ? 'is-active' : ''}`} onClick={()=>setOpen(!open)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      <div className="nav-divider" aria-hidden></div>
    </header>
  )
}
