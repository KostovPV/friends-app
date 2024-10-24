import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import SignInwithGoogle from "../../components/SignInWIthGoogle/SignInWIthGoogle";
import { useAuthContext } from "../../hooks/useAuthContext"; 
import './Login.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const { dispatch } = useAuthContext(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get user from the result

      // Dispatch the LOGIN action after successful login
      dispatch({ type: "LOGIN", payload: user });

      // console.log("User logged in Successfully");
      toast.success("Успешно влязохте в профила си!", {
        position: "top-center",
      });
      navigate("/");
    } catch (error) {
      console.log(error.message);
      let errorMessage = "Възникна грешка по време на влизане!";

      // Map Firebase error codes to friendly messages
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "Не е открит такъв потребител.";
          break;
        case "auth/wrong-password":
          errorMessage = "Неправилна парола или email.";
          break;
        case "auth/invalid-email":
          errorMessage = "Email-a не е валиден.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Твърде много опити за вход. Моля опитайте по-късно!";
          break;
        default:
          errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "bottom-center",
      });
    }
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

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Влез
          </button>
        </div>

        <SignInwithGoogle /> {/* Google Login Button */}

        <p className="forgot-password text-right">
          Нов потребител <a href="/register">Регистрирай се тук</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
