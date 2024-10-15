import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import SignInwithGoogle from "../../components/SignInWIthGoogle/SignInWIthGoogle";
import { useAuthContext } from "../../hooks/useAuthContext"; // Import useAuthContext for dispatch
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [file, setFile] = useState(null); // State to store selected file
  const [imageUploading, setImageUploading] = useState(false); // State to manage image upload progress
  const { dispatch } = useAuthContext(); // Get the dispatch function from AuthContext

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Create the user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user);

      let imageUrl = "";

      // If a profile image is selected, upload it to Firebase Storage
      if (file) {
        setImageUploading(true); // Set image uploading state

        const storageRef = ref(storage, `profileImages/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Upload file to Firebase Storage and get the download URL
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
            },
            (error) => {
              console.error("Error during image upload:", error);
              toast.error("Image upload failed");
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Image uploaded successfully, URL:", imageUrl);
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
          photo: imageUrl || "", // Save image URL if available, otherwise save an empty string
          role: "user", // Default role for regular users
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

        console.log("User successfully registered!");
        toast.success("User successfully registered!", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log("Error during registration:", error.message);
      let errorMessage = "An error occurred during registration.";

      // Map Firebase error codes to friendly messages
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered. Please use a different one.";
          break;
        case "auth/weak-password":
          errorMessage = "The password is too weak. Please use a stronger password.";
          break;
        case "auth/invalid-email":
          errorMessage = "The email address is not valid.";
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
          <label>Upload Profile Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])} // Update file state when the user selects a file
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary" disabled={imageUploading}>
          {imageUploading ? "Uploading..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="forgot-password text-right">
          Already registered? <a href="/login">Login</a>
        </p>

        {/* Google Sign Up Button */}
        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Signup;
