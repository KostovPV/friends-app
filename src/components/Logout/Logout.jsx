import { useEffect } from "react";
import { useLogout } from "../../hooks/useLogout"; // Adjust path as needed

const Logout = () => {
  const { logout } = useLogout();

  useEffect(() => {
    logout(); // Automatically trigger logout when component loads
  }, [logout]);

  return null; // No UI will be rendered
};

export default Logout;
