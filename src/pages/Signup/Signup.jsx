import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SignInwithGoogle from "../../components/SignInWIthGoogle/SignInWIthGoogle";
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [file, setFile] = useState(null); // State to store selected file
  const [imageUploading, setImageUploading] = useState(false); // State to manage image upload progress
  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

      let imageUrl = "";

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
        });

        console.log("Успешно регистриран потребител!!");
        toast.success("Успешно регистриран потребител!!", {
          position: "top-center",
        });

        navigate("/"); // Redirect to homepage after successful signup
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
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
          <label>Upload Profile Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])} // Update file state when the user selects a file
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={imageUploading}>
          {imageUploading ? "Обновяване..." : "Регистрирай се"}
        </button>

        <p className="forgot-password text-right">
          Вече регистриран <a href="/login">Вход</a>
        </p>

        {/* Google Sign Up Button */}
        <SignInwithGoogle />
      </form>
    </div>
  );
}

export default Signup;
