import React, { useState } from "react";
import "./Support.css";

export default function Support() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqList = [
    {
      q: "How do I generate my Smart ID Card?",
      a: "Go to the Generate ID section, fill your details, upload photo, and click Generate. Your digital ID card will be created instantly."
    },
    {
      q: "QR Code not scanning. What should I do?",
      a: "Ensure your camera is clean and the QR code is clearly visible. Try increasing brightness or zoom slightly for better detection."
    },
    {
      q: "How to verify a Smart ID?",
      a: "Open the Verify section → Scan QR → Enter security code → The system will decode and validate the ID details."
    },
    {
      q: "My ID details are wrong. How can I update?",
      a: "Contact the admin or faculty coordinator through the support form below and request changes."
    }
  ];

  return (
    <div className="support-container">

      {/* TITLE */}
      <h1 className="support-title">Support & Help Center</h1>
      <p className="support-subtitle">
        We're here to assist you with your Smart ID Card System.
      </p>

      {/* FAQ SECTION */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        {faqList.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${openFAQ === index ? "faq-open" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              {item.q}
              <span className="arrow">{openFAQ === index ? "−" : "+"}</span>
            </div>

            {openFAQ === index && (
              <div className="faq-answer">{item.a}</div>
            )}
          </div>
        ))}
      </div>

      {/* CONTACT SUPPORT SECTION */}
      <div className="contact-support">
        <h2>Contact Support</h2>
        <p>If you still need help, our team is ready to assist.</p>

        <form className="support-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Describe your issue..." required></textarea>
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}
