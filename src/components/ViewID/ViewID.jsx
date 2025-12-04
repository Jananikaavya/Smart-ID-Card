import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ViewID.css";

export default function ViewID() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const data = query.get("data");
    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data));
      // Get full user from localStorage
      const fullUser = JSON.parse(localStorage.getItem("smartid_current"));
      if (fullUser?.assignedId === parsed.id || fullUser?.id === parsed.id) {
        setUser(fullUser);
      } else {
        setUser(null);
      }
    }
  }, [location]);

  if (!user) {
    return (
      <div className="id-wrapper">
        <h2 className="id-title">No ID Found</h2>
        <p className="id-info">Invalid or missing QR data.</p>
      </div>
    );
  }

  return (
    <div className="id-wrapper">
      <h1 className="id-title">Smart ID</h1>

      <div className="id-card">
        <div className="id-left">
          <div className="id-photo-box">
            <img
              src={user.image || "/default-user.png"}
              alt="User"
              className="id-photo"
            />
          </div>
        </div>

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

