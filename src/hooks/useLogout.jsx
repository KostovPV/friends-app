import { useAuthContext } from "./useAuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      navigate('/'); // Redirect to home page after successful logout
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return { logout };
};
