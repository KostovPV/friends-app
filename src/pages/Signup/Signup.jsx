import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SignInwithGoogle from "../../components/SignInWIthGoogle/SignInWIthGoogle";
import { useAuthContext } from "../../hooks/useAuthContext"; 
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [file, setFile] = useState(null); 
  const [imageUploading, setImageUploading] = useState(false); 
  const { dispatch } = useAuthContext(); 

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let imageUrl = "";

      if (file) {
        setImageUploading(true); 
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Каването е " + progress + "% завършено");
            },
            (error) => {
              toast.error("Неуспешно качване на снимка!");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

        setImageUploading(false); 
      }

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: imageUrl || "",
          role: "user", 
          visitCount: 1,
          lastLogin: new Date(),
        });

        dispatch({
          type: "LOGIN",
          payload: {
            ...user,
            firstName: fname,
            lastName: lname,
            photoURL: imageUrl,
            role: "user",
          },
        });

        toast.success("Успешна регистрация!", {
          position: "top-center",
        });
      }
    } catch (error) {
      let errorMessage = "Възникна грешка по време на регистрацията.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email-а е вече регистриран.";
          break;
        case "auth/weak-password":
          errorMessage = "Твърде лесна парола.";
          break;
        case "auth/invalid-email":
          errorMessage = "Неавлиден email";
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
    <div className="signup">
      <form className="form" onSubmit={handleRegister}>
        <span>Регистрация</span>

        <input
          type="text"
          className="form-control"
          placeholder="Име"
          onChange={(e) => setFname(e.target.value)}
          required
        />

        <input
          type="text"
          className="form-control"
          placeholder="Фамилия"
          onChange={(e) => setLname(e.target.value)}
          required
        />

        <input
          type="email"
          className="form-control"
          placeholder="Въведи email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control"
          placeholder="Въведи парола"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="upload-container">
          <label>Kачи профилна снимка</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={imageUploading}>
          {imageUploading ? "Качване..." : "Регистрирай се"}
        </button>

        <p className="forgot-password text-right">
          Вече имаш регистрация? <a href="/login">Влез</a>
        </p>

        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Signup;
