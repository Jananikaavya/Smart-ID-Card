import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    regno: "",
    department: "",
    year: "",
    batch: "",
    guardian: "",
    empid: "",
    designation: "",
    experience: "",
    phone: "",
    image: ""
  });

  const [message, setMessage] = useState("");

  /** Load User */
  useEffect(() => {
    const current = localStorage.getItem("smartid_current");
    if (!current) {
      navigate("/login");
      return;
    }

    const u = JSON.parse(current);
    setUser(u);

    setForm({
      name: u.name || "",
      email: u.email || "",
      regno: u.regno || "",
      department: u.department || "",
      year: u.year || "",
      batch: u.batch || "",
      guardian: u.guardian || "",
      empid: u.empid || "",
      designation: u.designation || "",
      experience: u.experience || "",
      phone: u.phone || "",
      image: u.image || ""
    });
  }, [navigate]);

  if (!user) return null;

  /** Handle input change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** Handle image upload */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setForm((prev) => ({ ...prev, image: base64 }));

      // Update localStorage
      const users = JSON.parse(localStorage.getItem("smartid_users") || "[]");
      const idx = users.findIndex((u) => u.assignedId === user.assignedId);
      if (idx !== -1) {
        users[idx].image = base64;
        localStorage.setItem("smartid_users", JSON.stringify(users));
      }

      const updatedUser = { ...user, image: base64 };
      localStorage.setItem("smartid_current", JSON.stringify(updatedUser));
      setUser(updatedUser);
    };
    reader.readAsDataURL(file);
  };

  /** Save profile */
  const saveProfile = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("smartid_users") || "[]");
    const idx = users.findIndex((u) => u.assignedId === user.assignedId);

    if (idx !== -1) {
      users[idx] = { ...users[idx], ...form };
      localStorage.setItem("smartid_users", JSON.stringify(users));

      const updatedUser = { ...user, ...form };
      localStorage.setItem("smartid_current", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 1500);
      setEditing(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Smart ID</h2>
        <nav className="side-nav">
          <button className={`nav-item ${!editing ? "active" : ""}`} onClick={() => setEditing(false)}>Dashboard</button>
          <button className={`nav-item ${editing ? "active" : ""}`} onClick={() => setEditing(true)}>Edit Profile</button>
          <Link className="nav-item" to="/verify">Verify </Link>
          <Link className="nav-item" to="/generate">Generate ID</Link>
          <Link className="nav-item" to="/settings">Settings</Link>
          <button className="nav-item logout" onClick={() => { localStorage.removeItem("smartid_current"); navigate("/login"); }}>Logout</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="main">
        {!editing ? (
          <>
            {/* Dashboard View */}
            <section className="welcome">
              <h1>Welcome, <span className="accent">{user.name}</span></h1>
              <p>Your personalized identity dashboard</p>
            </section>

            <div className="profile-card">
              <img src={user.image || "/avatar.png"} alt="Profile" className="avatar" />
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p className="email">{user.email}</p>
                <span className={`role-tag ${user.role}`}>
                  {user.role === "student" ? "Student" : user.role === "employee" ? "Employee" : "Admin"}
                </span>
                <div className="details">
                  {user.role !== "admin" && (
                    <>
                      <p><strong>ID:</strong> {user.assignedId}</p>
                      {user.role === "student" && <>
                        <p><strong>Register No:</strong> {user.regno || "Not Provided"}</p>
                        <p><strong>Department / Course:</strong> {user.department || "Not Provided"}</p>
                      </>}
                      {user.role === "employee" && <>
                        <p><strong>Employee ID:</strong> {user.empid || user.assignedId}</p>
                        <p><strong>Department:</strong> {user.department || "Not Provided"}</p>
                        <p><strong>Designation:</strong> {user.designation || "Not Provided"}</p>
                      </>}
                      <p><strong>Verification Status:</strong> {user.verified ? "Verified" : "Pending"}</p>
                    </>
                  )}
                  {user.role === "admin" && <p><strong>Admin Access Enabled</strong></p>}
                </div>
              </div>
            </div>

           <div className="tiles">
  <Link to="/verify/student" className="tile">
    <h3>Verify Student</h3>
    <p>Scan or enter Student ID to verify.</p>
  </Link>

  <Link to="/verify/employee" className="tile">
    <h3>Verify Employee</h3>
    <p>Scan or enter Employee ID to verify.</p>
  </Link>

  <Link to="/settings" className="tile">
    <h3>Settings</h3>
    <p>Manage UI & privacy settings.</p>
  </Link>
</div>

          </>
        ) : (
          <>
            {/* Edit Profile */}
            <div className="edit-section">
              <h2>Edit Profile</h2>
              {message && <p className="msg">{message}</p>}

              <form className="profile-form" onSubmit={saveProfile}>
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />

                <label>Email</label>
                <input name="email" value={form.email} onChange={handleChange} />

                {/* Student Fields */}
                {user.role === "student" && (
                  <>
                    <label>Register No</label>
                    <input name="regno" value={form.regno} onChange={handleChange} />
                    <label>Course / Department</label>
                    <input name="department" value={form.department} onChange={handleChange} />
                    <label>Year</label>
                    <input name="year" value={form.year} onChange={handleChange} />
                    <label>Batch</label>
                    <input name="batch" value={form.batch} onChange={handleChange} />
                   
                  </>
                )}

                {/* Employee Fields */}
                {user.role === "employee" && (
                  <>
                    <label>Employee ID</label>
                    <input name="empid" value={form.empid} onChange={handleChange} />
                    <label>Department</label>
                    <input name="department" value={form.department} onChange={handleChange} />
                    <label>Designation</label>
                    <input name="designation" value={form.designation} onChange={handleChange} />
                    <label>Experience (Years)</label>
                    <input name="experience" value={form.experience} onChange={handleChange} />
                    <label>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />
                  </>
                )}

                {/* Profile Picture */}
                <div className="profile-pic-wrapper">
                  <label className="profile-pic-container">
                    <img src={form.image || "/avatar.png"} alt="Profile" />
                    <div className="upload-overlay">Change Photo</div>
                    <input type="file" accept="image/*" className="profile-pic-input" onChange={handleImageUpload} />
                  </label>
                </div>

                <button className="primary" type="submit">Save Profile</button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
