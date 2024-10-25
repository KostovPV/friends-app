import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../../firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import './Upload.css';

export default function Upload() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [manualUsernames, setManualUsernames] = useState([]);
  const [manualUsernameInput, setManualUsernameInput] = useState("");
  const [comment, setComment] = useState("");

  // Fetch users from Firestore when the component mounts
  useEffect(() => {
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
      setManualUsernameInput("");
    }
  };

  const uploadImage = async () => {
    if (!imageFile) {
      setError("No file selected");
      return;
    }

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
        comments: [],
      });

      console.log("File available at:", downloadUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Error uploading file: " + error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="upload-page-container">

      <h2>Качи снимка</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* User Dropdown for tagging */}
      <div className='select-users'>
        <label>Изберете потребители за отбелязване:</label>
        <select multiple onChange={handleUserSelect} value={selectedUsers}>
          {users.map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
        </select>
        <div className='select-unregistered-users'>
          <span>Не виждаш потребител в спъсъкс с регистрирани потребители? </span>

          <p>Добави име на потребител:</p>
          <input
            type="text"
            value={manualUsernameInput}
            onChange={(e) => setManualUsernameInput(e.target.value)}
            placeholder="Въведи потребител, който да отбележиш"
          />
          <button onClick={addManualUser}>Добави име</button>
        </div>
      </div>

      <div className='comments-area'>
        <label>Добави коментар:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Въведете вашият коментар"
        ></textarea>
      </div>

      {/* Show selected users */}
      <div>
        <h3>Отбелязани потребители:</h3>
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
          <p>Все още няма отбелязани потребители.</p>
        )}
      </div>

      <button onClick={uploadImage} disabled={loading}>
        {loading ? "Качване..." : "Качи снимка"}
      </button>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display uploaded image */}
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Прикачен файл" width="200" />
        </div>
      )}
    </div>
  );
}
