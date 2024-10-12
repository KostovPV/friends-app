import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="login">
      <form className="form" onSubmit={handleSubmit}>
        <span>Вход за потребители</span>

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

        {!isPending && <button>Влез</button>}
        {isPending && <button disabled>Зарежда се</button>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
