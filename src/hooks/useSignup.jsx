import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export const useSignup = () => {
  const [error, setError] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const signup = async (email, password) => {
    setError(null);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'LOGIN', payload: res.user });
      console.log('User signed up successfully:', res.user);

      // Redirect to the home page on successful signup
      navigate('/'); // Redirect to the home page

    } catch (err) {
      setError(err.message);
      console.error("Signup Error:", err.message);  // Log the error message for debugging
    }
  };

  return { error, signup };
};
