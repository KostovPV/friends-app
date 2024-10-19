import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
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
      // Create the user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log("User created:", user);

      let imageUrl = "";

      // If a profile image is selected, upload it to Firebase Storage
      if (file) {
        setImageUploading(true); 

        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Upload file to Firebase Storage and get the download URL
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Каването е " + progress + "% завършено");
            },
            (error) => {
              // console.error("Error during image upload:", error);
              toast.error("Неуспешно качване на снимка!");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              // console.log("Image uploaded successfully, URL:", imageUrl);
              resolve();
            }
          );
        });

        setImageUploading(false); // Reset image uploading state after completion
      }

      if (user) {
        // Save user information to Firestore, including the image URL
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: imageUrl || "", 
          role: "user", 
        });

        // Dispatch the LOGIN action after successful signup
        dispatch({
          type: "LOGIN",
          payload: {
            ...user,
            firstName: fname,
            lastName: lname,
            photoURL: imageUrl, // Add image URL to user data
            role: "user",
          },
        });

        // console.log("User successfully registered!");
        toast.success("Успешна регистрация!", {
          position: "top-center",
        });
      }
    } catch (error) {
      // console.log("Error during registration:", error.message);
      let errorMessage = "Възникна грешка по време на регистрацията.";

      // Map Firebase error codes to friendly messages
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email-а е вече регистриран. Моля въведете друг.";
          break;
        case "auth/weak-password":
          errorMessage = "Твърде лесна парола. Моля въведете по-сигурна парола";
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

        {/* First Name */}
        <input
          type="text"
          className="form-control"
          placeholder="Име"
          onChange={(e) => setFname(e.target.value)}
          required
        />

        {/* Last Name */}
        <input
          type="text"
          className="form-control"
          placeholder="Фамилия"
          onChange={(e) => setLname(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          className="form-control"
          placeholder="Въведи email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          className="form-control"
          placeholder="Въведи парола"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Profile Image Upload */}
        <div className="upload-container">
          <label>Kачи профилна снимка</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])} 
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={imageUploading}>
          {imageUploading ? "Качване..." : "Регистрирай се"}
        </button>

        {/* Login Link */}
        <p className="forgot-password text-right">
          Вече имаш регистрация? <a href="/login">Влез</a>
        </p>

        {/* Google Sign Up Button */}
        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Signup;
