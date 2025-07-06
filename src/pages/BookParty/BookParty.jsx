// import React, { useState } from "react";
// import emailjs from "emailjs-com";
// import { useNavigate } from "react-router-dom"; 
// import { toast } from "react-toastify";  // Import toast from react-toastify
// import 'react-toastify/dist/ReactToastify.css';  // Import react-toastify styles
// import "./BookParty.css";

// const BookParty = () => {
//   const [formData, setFormData] = useState({
//     // location: "",
//     childrenCount: "",
//     theme: "",
//     date: "",
//     time: "",
//     additionalInfo: "",
//     contactName: '',
//     email: "",
//     phone: ""
//   });

//   const navigate = useNavigate(); 

//   // Handle form field changes
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate inputs before submission
//     if ( !formData.childrenCount || !formData.theme || !formData.date || !formData.time || !formData.email || !formData.phone) {
//       toast.error("Моля попълнете всички задължителни полета!", {
//         position: "bottom-center"
//       });
//       return;
//     }

//     // Call function to send email
//     sendEmail(formData);
//   };

//   // This function sends email using EmailJS
//   const sendEmail = (formData) => {
//     const emailParams = {
//       to_name: "Website Owner",
//       from_name: formData.contactName,
//       reply_to: formData.email,
//       // location: formData.ocation,
//       childrenCount: formData.childrenCount,
//       theme: formData.theme,
//       date: formData.date,
//       time: formData.time,
//       contactName: formData.contactName,
//       email: formData.email,
//       phone: formData.phone,
//       additionalInfo: formData.additionalInfo || "Няма предоставена",
//     };

//     emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//       emailParams,
//       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
//     )
//       .then((response) => {
//         toast.success("Заяката ви беше изпратена успешно, ще се свържем с вас най-скоро!", {
//           position: "top-center",
//         });
//         navigate('/'); 
//       }, (error) => {
//         toast.error("Зявката ви не беше изпратена. Опитайте итново!", {
//           position: "bottom-center"
//         });
//       });
//   };

//   return (
//     <div className="form-container">
//       <form onSubmit={handleSubmit} className="booking-form">
//         <h2>Запази парти</h2>

//         {/* Location */}
//         {/* <label>
//           Повод:
//           <input
//             type="text"
//             name="ocation"
//             value={formData.ocation}
//             onChange={handleChange}
//             required
//           />
//         </label> */}

//         {/* Number of children */}
//         <label>
//           Брой деца:
//           <input
//             type="number"
//             name="childrenCount"
//             value={formData.childrenCount}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Theme */}
//         <label>
//           Тема на парти:
//           <input
//             type="text"
//             name="theme"
//             value={formData.theme}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Date */}
//         <label>
//           Дата:
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Time */}
//         <label>
//           Час:
//           <input
//             type="time"
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* contactName */}
//         <label>
//           Име за контакт:
//           <input
//             type="text"
//             name="contactName"
//             value={formData.contactName}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Email */}
//         <label>
//           Email за контакт:
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Phone */}
//         <label>
//           Телефон за връзка:
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Additional Information */}
//         <label>
//           Допълнителна информация:
//           <textarea
//             name="additionalInfo"
//             value={formData.additionalInfo}
//             onChange={handleChange}
//             placeholder="Въведете допълнителна информация, която меже да ни е от полза?"
//           />
//         </label>

//         <button type="submit">Изпрати запитване</button>
//       </form>
//     </div>
//   );
// };

// export default BookParty;


import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BookParty.css";

const BookParty = () => {
  const [formData, setFormData] = useState({
    childrenCount: "",
    theme: "",
    date: "",
    time: "",
    additionalInfo: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = (data) =>
    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_name: "Website Owner",
        from_name: data.contactName,
        reply_to: data.email,
        childrenCount: data.childrenCount,
        theme: data.theme,
        date: data.date,
        time: data.time,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        additionalInfo: data.additionalInfo || "Няма предоставена",
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

  const sendSms = async (data) => {
    const toPhone =
      data.phone.startsWith("+")
        ? data.phone
        : `+359${data.phone.replace(/^0/, "")}`;

    const res = await fetch(import.meta.env.VITE_TWILIO_FUNCTION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: toPhone,
        contactName: data.contactName,
        date: data.date,
        time: data.time,
      }),
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "SMS изпращането се провали.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.childrenCount ||
      !formData.theme ||
      !formData.date ||
      !formData.time ||
      !formData.email ||
      !formData.phone
    ) {
      toast.error("Моля попълнете всички задължителни полета!", {
        position: "bottom-center",
      });
      return;
    }

    try {
      await Promise.all([sendEmail(formData), sendSms(formData)]);

      toast.success(
        "Запитването е изпратено успешно – ще се свържем с вас!",
        { position: "top-center" }
      );
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Изпращането неуспешно. Опитайте отново!", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="booking-form">
        <h2>Запази парти</h2>

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

        <label>
          Име за контакт:
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            required
          />
        </label>

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

        <label>
          Допълнителна информация:
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Въведете допълнителна информация, която може да ни е от полза"
          />
        </label>

        <button type="submit">Изпрати запитване</button>
      </form>
    </div>
  );
};

export default BookParty;
