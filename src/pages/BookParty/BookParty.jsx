import React, { useState } from "react";
import emailjs from "emailjs-com";

const BookParty = () => {
  const [formData, setFormData] = useState({
    ocation: "",
    childrenCount: "",
    theme: "",
    date: "",
    time: "",
    additionalInfo: "",
    contactName: '',
    email: "",
    phone: ""
  });

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs before submission
    if (!formData.ocation || !formData.childrenCount || !formData.theme || !formData.date || !formData.time || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    // Call function to send email
    sendEmail(formData);
  };

  // This function will send email using EmailJS
  const sendEmail = (formData) => {
    const emailParams = {
      to_name: "Website Owner",
      from_name: formData.contactName,  // Contact name in "From"
      reply_to: formData.email,
      ocation: formData.ocation,
      childrenCount: formData.childrenCount,
      theme: formData.theme,
      date: formData.date,
      time: formData.time,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      additionalInfo: formData.additionalInfo || "None provided",
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      emailParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then((response) => {
        alert("Booking request sent successfully!");
      }, (error) => {
        alert("Failed to send booking request. Please try again.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <h2>Book a Party</h2>

      {/* Location */}
      <label>
        Повод:
        <input
          type="text"
          name="ocation"
          value={formData.ocation}
          onChange={handleChange}
          required
        />
      </label>

      {/* Number of children */}
      <label>
        Брой деца:
        <input
          type="number"
          name="childrenCount"
          value={formData.childrenCount}
          onChange={handleChange}
          required
        />
      </label>

      {/* Theme */}
      <label>
        Тема на парти:
        <input
          type="text"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          required
        />
      </label>

      {/* Date */}
      <label>
        Дата:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </label>

      {/* Time */}
      <label>
        Час:
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
      </label>

      {/* contactName */}
      <label>
        Име за контакт:
        <input
          type="contactName"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          required
        />
      </label>

      {/* Email */}
      <label>
        Email за контакт:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      {/* Phone */}
      <label>
        Телефон за връзка:
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </label>

      {/* Additional Information */}
      <label>
        Допълнителна информация:
        <textarea
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Any additional requests or questions?"
        />
      </label>

      <button type="submit">Submit Booking</button>
    </form>
  );
};

export default BookParty;


