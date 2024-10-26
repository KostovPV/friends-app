import { useEffect } from "react";
import  useLogout  from "../../hooks/useLogout"; 

const Logout = () => {
  const { logout } = useLogout();

  useEffect(() => {
    logout(); 
  }, [logout]);

  return null; 
};

export default Logout;
