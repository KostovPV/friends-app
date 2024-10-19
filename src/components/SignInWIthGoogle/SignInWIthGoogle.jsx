import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import googleImage from "../../../src/assets/google.png"; 
import { useNavigate } from "react-router-dom"; 

function SignInwithGoogle() {
  const navigate = useNavigate(); 

  function googleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        const user = result.user;
        if (user) {
          await setDoc(doc(db, "Users", user.uid), {
            email: user.email,
            firstName: user.displayName,
            photo: user.photoURL,
            lastName: "",
          });

          toast.success("Успешно вляхохте с профилът си в google!", {
            position: "top-center",
          });

          // Use navigate instead of window.location.href
          navigate("/");
        }
      })
      .catch((error) => {
        toast.error("Грешка при влизане с Google", {
          position: "top-center",
        });
        console.error("Error during Google login: ", error);
      });
  }

  return (
    <div>
      <p className="continue-p">-- Или продължи с  --</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={googleImage} width={"60%"} alt="Google Sign-In" />
      </div>
    </div>
  );
}

export default SignInwithGoogle;
