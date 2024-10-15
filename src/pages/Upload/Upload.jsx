import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig'; // Adjust path as needed
import { collection, addDoc, getDocs } from 'firebase/firestore'; // Firestore functions

export default function Upload() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // Fetched users list
  const [selectedUsers, setSelectedUsers] = useState([]); // Store selected users
  const [manualUsernames, setManualUsernames] = useState([]); // Store manually entered usernames
  const [manualUsernameInput, setManualUsernameInput] = useState(""); // Input field for manual username
  const [comment, setComment] = useState(""); // User's comment

  useEffect(() => {
    // Fetch users from Firestore when the component mounts
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'Users')); // Fetch 'Users' collection
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList); // Set fetched users in the state
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please select a JPEG, PNG, or GIF image.");
        setImageFile(null);
        return;
      }
      setError("");
      setImageFile(file);
    }
  };

  const handleUserSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selected); // Add selected users from the dropdown
  };

  const addManualUser = () => {
    if (manualUsernameInput && !manualUsernames.includes(manualUsernameInput)) {
      setManualUsernames((prev) => [...prev, manualUsernameInput]);
      setManualUsernameInput(""); // Clear input after adding
    }
  };

  const uploadImage = async () => {
    if (imageFile) {
      setLoading(true); // Set loading state
      const storageRef = ref(storage, `images/${imageFile.name}`);
      try {
        // Upload image to Firebase storage
        await uploadBytes(storageRef, imageFile);
        const downloadUrl = await getDownloadURL(storageRef);
        setImageUrl(downloadUrl);

        // Combine selected users from dropdown and manually entered usernames
        const allTaggedUsers = [...selectedUsers, ...manualUsernames];

        // Store the image URL, tagged users, and comment in Firestore
        await addDoc(collection(db, "images"), {
          url: downloadUrl,
          fileName: imageFile.name,
          taggedUsers: allTaggedUsers, // Save both dropdown and manually entered users
          comment: comment,
          createdAt: new Date(),
          likes: [],
          comments: [], // Initialize comments array for future use
        });

        console.log("File available at:", downloadUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        setError("Error uploading file: " + error.message); // Set error state
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      setError("No file selected");
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>

      {/* Image upload input */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* User Dropdown for tagging */}
      <div>
        <label>Select users to tag:</label>
        <select multiple onChange={handleUserSelect} value={selectedUsers}>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      {/* Manually add a user tag */}
      <div>
        <input
          type="text"
          value={manualUsernameInput}
          onChange={(e) => setManualUsernameInput(e.target.value)}
          placeholder="Enter username to tag"
        />
        <button onClick={addManualUser}>Add Manually</button>
      </div>

      {/* Comment Input */}
      <div>
        <label>Add a comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment"
        ></textarea>
      </div>

      {/* Show selected users */}
      <div>
        <h3>Tagged Users:</h3>
        {selectedUsers.length > 0 || manualUsernames.length > 0 ? (
          <ul>
            {/* List selected users from dropdown */}
            {selectedUsers.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
            {/* List manually entered usernames */}
            {manualUsernames.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        ) : (
          <p>No users tagged yet.</p>
        )}
      </div>

      <button onClick={uploadImage} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display uploaded image */}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded file" width="200" />
        </div>
      )}
    </div>
  );
}
