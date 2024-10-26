import { useAuthContext } from "./useAuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      toast.success('Излязохте от профила си в "Детски център Friends"', {
        position: "top-center",
      });

      navigate('/');
    } catch (error) {
      console.error('Logout error:', error.message);
      toast.error('Грешка при излизане от профила. Моля, опитайте отново.');
    }
  };

  return { logout };
};

export default useLogout;
