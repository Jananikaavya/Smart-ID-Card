import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./Generate.css";

export default function Generate() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("smartid_current"));
    setUser(data);
  }, []);

  if (!user) {
    return (
      <div className="id-wrapper">
        <h2 className="id-title">No ID Found</h2>
        <p className="id-info">Please verify first.</p>
      </div>
    );
  }

  // Minimal QR code to avoid overflow
  const qrData = `${window.location.origin}/view-id?data=${encodeURIComponent(
    JSON.stringify({ id: user.assignedId || user.id, role: user.role })
  )}`;

  return (
    <div className="id-wrapper">
      <h1 className="id-title">Your Smart ID</h1>

      <div className="id-card">
        {/* LEFT SIDE PHOTO + QR */}
        <div className="id-left">
          <div className="id-photo-box">
            <img
              src={user.image || "/default-user.png"}
              alt="User"
              className="id-photo"
            />
          </div>

          <div className="qr-section">
            <QRCode value={qrData} size={120} />
          </div>
        </div>

        {/* RIGHT SIDE DETAILS */}
        <div className="id-right">
          <h2 className="id-name">{user.name}</h2>
          <p className="id-role">{user.role.toUpperCase()}</p>
          <p className="id-field">
            <strong>ID:</strong> {user.assignedId || user.id}
          </p>

          {user.role === "student" && (
            <>
              <p className="id-field">
                <strong>Register No:</strong> {user.regno || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Department / Course:</strong> {user.department || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Year:</strong> {user.year || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Batch:</strong> {user.batch || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Guardian:</strong> {user.guardian || "Not Provided"}
              </p>
            </>
          )}

          {user.role === "employee" && (
            <>
              <p className="id-field">
                <strong>Employee ID:</strong> {user.empid || user.assignedId || user.id}
              </p>
              <p className="id-field">
                <strong>Department:</strong> {user.department || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Designation:</strong> {user.designation || "Not Provided"}
              </p>
              <p className="id-field">
                <strong>Experience:</strong> {user.experience || "Not Provided"} Years
              </p>
              <p className="id-field">
                <strong>Phone:</strong> {user.phone || "Not Provided"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
