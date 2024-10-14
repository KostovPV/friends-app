import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import './Profile.css'; // Import the CSS file

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false); // New state for Google user

  // Fetch user data from Firestore
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('user->', user);
        // Check if the user logged in via Google
        const providerId = user.providerData[0]?.providerId;
        setIsGoogleUser(providerId === 'google.com'); // Set flag if Google login
        
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserDetails(data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || "");
          console.log('data', data);
        }
      } else {
        console.log("User is not logged in");
      }
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || isGoogleUser) return; // Prevent updates for Google users

    if (!firstName.trim()) {
      toast.error("First name is required!");
      return;
    }

    try {
      let imageUrl = userDetails?.photo || ""; // Keep the old photo URL if no new image is uploaded

      // If a new file is selected, upload it to Firebase Storage
      if (file) {
        setImageUploading(true); // Set uploading state

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
              setImageUploading(false); // Ensure state is updated even if upload fails
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("Image uploaded successfully, URL:", imageUrl);
              resolve();
            }
          );
        });

        setImageUploading(false); // Reset uploading state
      }

      // Update Firestore document
      await updateDoc(doc(db, "Users", user.uid), {
        firstName,
        lastName,
        photo: imageUrl, // Save the new image URL if available
      });

      toast.success("Profile updated successfully");
      setEditMode(false); // Exit edit mode after saving changes
      fetchUserData(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Profile update failed");
    }
  };

  // Handle logout
  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <div className="profile-container">
      {userDetails ? (
        <>
          <div className="profile-image-container">
            <img
              src={userDetails.photo || "default-avatar.png"} // Provide a default image
              alt={`${userDetails.firstName}'s Profile`} // Add better alt text for accessibility
              className="profile-image"
            />
          </div>

          {!editMode ? (
            <>
              <h3>Здравей {userDetails.firstName} 🙏🙏</h3>
              <div className="profile-details">
                <p>Email: {userDetails.email}</p>
                <p>Име: {userDetails.firstName}</p>
                <p>Фамилия: {userDetails.lastName}</p>
              </div>

              {/* Only show edit button if user did not log in with Google */}
              {!isGoogleUser && (
                <button className="btn btn-secondary" onClick={() => setEditMode(true)}>
                  Редактирай профила
                </button>
              )}
            </>
          ) : (
            <>
              <h3>Edit Profile</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label>Име</label>
                  <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Фамилия</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Email (Не се редактира)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Качи нова профилна снимка</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={imageUploading}
                >
                  {imageUploading ? "Обновява се..." : "Запази промените"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  Откажи
                </button>
              </form>
            </>
          )}
          <button className="btn btn-primary mt-3" onClick={handleLogout}>
            Изход
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
