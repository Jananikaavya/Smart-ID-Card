import React, { useState } from "react";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import "./Verify.css";

export default function Verify() {
  const [idInput, setIdInput] = useState("");
  const [generatedQR, setGeneratedQR] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [verifyResult, setVerifyResult] = useState("");
  const [verifiedData, setVerifiedData] = useState(null);

  const navigate = useNavigate();

  const getRoleFromID = (id) => {
    if (id.startsWith("S") || id.startsWith("s")) return "student";
    if (id.startsWith("E") || id.startsWith("e")) return "employee";
    return "unknown";
  };

  const handleGenerateQR = async () => {
    if (!idInput.trim()) return alert("Enter ID first!");

    const role = getRoleFromID(idInput.trim());
    const jsonData = { id: idInput.trim(), role };

    const qr = await QRCode.toDataURL(JSON.stringify(jsonData));
    setGeneratedQR(qr);
  };

  const updateVerificationStatus = (id, role) => {
    const users = JSON.parse(localStorage.getItem("smartid_users") || "[]");
    const index = users.findIndex((u) => u.assignedId === id);

    if (index !== -1) {
      users[index].verified = true;
      users[index].verifiedAt = new Date().toLocaleString();
      localStorage.setItem("smartid_users", JSON.stringify(users));

      const current = JSON.parse(localStorage.getItem("smartid_current") || "{}");
      if (current.assignedId === id) {
        current.verified = true;
        current.verifiedAt = new Date().toLocaleString();
        localStorage.setItem("smartid_current", JSON.stringify(current));
      }
      return true;
    }
    return false;
  };

  const saveAndRedirect = (user) => {
    localStorage.setItem(
      "verifiedUser",
      JSON.stringify({ id: user.id, role: user.role })
    );

    alert("✅ Verification Successful! Redirecting to Generate ID page...");
    navigate("/generate");
  };

  const handleManualVerify = () => {
    if (!enteredCode.trim()) return setVerifyResult("❌ Enter scanned QR JSON first");

    try {
      const parsed = JSON.parse(enteredCode);

      if (!parsed.id) return setVerifyResult("❌ Invalid QR (ID missing)");
      if (!["student", "employee"].includes(parsed.role)) return setVerifyResult("❌ Unknown role");

      const success = updateVerificationStatus(parsed.id, parsed.role);

      if (success) {
        setVerifiedData(parsed);
        setVerifyResult(`✅ ID Verified Successfully (${parsed.role.toUpperCase()})`);
        saveAndRedirect(parsed);
      } else {
        setVerifyResult("⚠ ID not found in system");
      }
    } catch {
      setVerifyResult("❌ Invalid JSON");
    }
  };

  return (
    <div className="id-wrapper">
      <h1 className="id-title">Smart ID – Verification</h1>

      {/* GENERATE QR */}
      <div className="id-card">
        <div className="id-details">
          <h2 className="id-name">Generate QR</h2>
          <input
            type="text"
            className="input-box"
            placeholder="Enter ID (Example: S12345)"
            value={idInput}
            onChange={(e) => setIdInput(e.target.value)}
          />
          <button className="btn" onClick={handleGenerateQR}>Generate QR</button>

          {generatedQR && (
            <div className="qr-section">
              <img src={generatedQR} alt="qr" />
              <p>Scan this QR</p>
            </div>
          )}
        </div>
      </div>

      {/* MANUAL VERIFY */}
      {!verifiedData && (
        <div className="id-card" style={{ marginTop: "25px" }}>
          <div className="id-details">
            <h2 className="id-name">Verify ID</h2>
            <textarea
              className="input-box"
              placeholder="Paste scanned QR JSON here"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
            />
            <button className="btn verify-btn" onClick={handleManualVerify}>
              Verify Now
            </button>
            {verifyResult && <div className="result">{verifyResult}</div>}
          </div>
        </div>
      )}

      {verifiedData && (
        <div className="id-card" style={{ marginTop: "25px" }}>
          <div className="id-details">
            <h2 className="id-name">Verification Details</h2>
            <p className="id-field"><strong>ID:</strong> {verifiedData.id}</p>
            <p className="id-field"><strong>Role:</strong> {verifiedData.role}</p>
            <p className="id-field"><strong>Status:</strong> Verified</p>
            <p className="id-field"><strong>Time:</strong> {new Date().toLocaleString()}</p>
            <p className="id-field">Redirecting to Generate ID page...</p>
          </div>
        </div>
      )}
    </div>
  );
}
