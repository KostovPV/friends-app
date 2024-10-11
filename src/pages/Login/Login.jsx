import { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'

// styles
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(email, password)
  }

  return (


    <div className="loginForm">
      <div className="login-form">
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


          {!isPending && <button className="btn">Влез</button>}
          {isPending && <button className="btn" disabled>Зарежда се</button>}
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>

  )
}
