import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate(); // Initialize the navigate function

    const login = async (email, password) => {
        setError(null);

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            dispatch({ type: 'LOGIN', payload: res.user });
            console.log('User logged in successfully:', res.user);
            navigate('/'); // Redirect to home after successful login
        } catch (err) {
            setError(err.message);
            console.error("Login error:", err.message); // Log the error message for debugging
        }
    };

    return { error, login };
};
