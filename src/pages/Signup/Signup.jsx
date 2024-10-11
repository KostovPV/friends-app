import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';
import './Signup.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, signup } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password);  // Trigger signup and handle redirect
  };

  return (
    <div className="signup">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <span>Регистрирай се</span>

          <input
            type="email"
            name="email"
            placeholder="Въведи email"
            className="form-control inp_text"
            id="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />

          <input
            required
            type="password"
            name="password"
            placeholder="Въведи парола"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button>Регистрирай се</button>

          {/* Display error if any */}
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
