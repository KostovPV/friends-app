import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import googleImage from "../../../src/assets/google.png"; 
import { useNavigate } from "react-router-dom"; 

function SignInwithGoogle() {
  const navigate = useNavigate(); 

  async function googleLogin() {
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            firstName: user.displayName,
            photo: user.photoURL,
            lastName: "",
            role: "user",
            visitCount: 1,
            lastLogin: new Date(),
          });
        } else {
          const visitCount = (userDoc.data().visitCount || 0) + 1;
          await updateDoc(userDocRef, {
            lastLogin: new Date(),
            visitCount: visitCount,
          });
        }

        toast.success("Успешно вляхохте с профилът си в google!", {
          position: "top-center",
        });

        navigate("/");
      }
    } catch (error) {
      toast.error("Грешка при влизане с Google", {
        position: "top-center",
      });
      console.error("Error during Google login: ", error);
    }
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
