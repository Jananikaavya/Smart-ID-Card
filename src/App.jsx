import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Admin from './components/Admin/Admin';
import Dashboard from './components/Dashboard/Dashboard';
import Verify from './components/Verify/Verify';    // ✅ FIXED
import Hero from './components/Hero/Hero';
import Generate from './components/Generate/Generate';
import Support from './components/Support/Support';
import ViewID from './components/ViewID/ViewID';
import Footer from './components/Footer/Footer';
function Placeholder({ title }) {
  return (
    <div style={{ padding: 32, color: 'var(--text)' }}>
      <h2 style={{ color: 'var(--heading)' }}>{title}</h2>
      <p style={{ maxWidth: 800, opacity: 0.9 }}>
        Placeholder for the <strong>{title}</strong> view.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-root">

        {/* Background layers */}
        <div className="bg-canvas" aria-hidden="true">
          <div className="particles"></div>
          <div className="circuits"></div>
        </div>

        <Navbar />

        <div style={{ position: 'relative', zIndex: 4, marginTop: 12 }}>
          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

           <Route path="/verify" element={<Verify />} />
<Route path="/verify/student" element={<Verify role="student" />} />
<Route path="/verify/employee" element={<Verify role="employee" />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin protected route */}
            <Route
              path="/admin"
              element={(() => {
                try {
                  const c = JSON.parse(localStorage.getItem("smartid_current") || "null");
                  if (c && c.role === "admin") return <Admin />;
                } catch { }
                return <Navigate to="/login" replace />;
              })()}
            />

            {/* Other placeholders */}
            <Route path="/generate" element={<Generate />} />
                <Route path="/view-id" element={<ViewID />} />
            <Route path="/support" element={<Support/>} />
             <Route path="*" element={<Placeholder title="Not Found" />} />
        </Routes>
        </div>
       
      </div>
        <Footer/>
    </BrowserRouter>
    
  );
}
