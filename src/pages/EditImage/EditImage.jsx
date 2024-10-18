import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { getDocs, collection } from 'firebase/firestore'; 
import './EditImage.css';

export default function EditImagePage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]); 
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [manualUsernames, setManualUsernames] = useState([]); 
    const [manualUsernameInput, setManualUsernameInput] = useState(""); 
    const [comment, setComment] = useState(""); 

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const imageRef = doc(db, 'images', id);
                const imageSnapshot = await getDoc(imageRef);
                if (imageSnapshot.exists()) {
                    const data = imageSnapshot.data();
                    setImageData(data);
                    setSelectedUsers(data.taggedUsers || []); // Initialize selected users
                    setComment(data.comment || ''); // Initialize comment
                } else {
                    console.error('Image not found');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching image:', error);
                setLoading(false);
            }
        };

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
            }
        };

        fetchImage();
        fetchUsers(); // Fetch users from Firestore
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setImageData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle user selection and preserve previously selected ones
    const handleUserSelect = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);

        // Merge new selections with previously selected ones without duplicates
        setSelectedUsers((prevSelected) => [
            ...new Set([...prevSelected, ...selected])
        ]);
    };

    const addManualUser = () => {
        if (manualUsernameInput && !manualUsernames.includes(manualUsernameInput)) {
            setManualUsernames((prev) => [...prev, manualUsernameInput]);
            setManualUsernameInput(""); // Clear input after adding
        }
    };

    const removeTaggedUser = (user) => {
        setSelectedUsers((prev) => prev.filter((u) => u !== user));
        setManualUsernames((prev) => prev.filter((u) => u !== user));
    };

    const handleSave = async () => {
        try {
            const imageRef = doc(db, 'images', id);
            const allTaggedUsers = [...selectedUsers, ...manualUsernames];

            await updateDoc(imageRef, {
                ...imageData,
                taggedUsers: allTaggedUsers, 
                comment: comment, 
            });

            alert('Image updated successfully');
            navigate('/gallery'); 
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, 'images', id)); 
            alert('Image deleted successfully');
            navigate('/gallery'); 
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    if (loading) {
        return <div>Loading image details...</div>;
    }

    return (
        <div className="edit-page-container">
            <h2>Редактирай снимка</h2>
            {imageData ? (
                <>
                    <div className="edit-image-container">
                        <img src={imageData.url} alt={imageData.fileName} />
                    </div>
                    <div className="edit-form">
                        <label>Заглавие:</label>
                        <input
                            type="text"
                            name="title"
                            value={imageData.title || ''}
                            onChange={handleInputChange}
                        />

                        {/* Dropdown for selecting users */}
                        <label>Избери потребител за отбелязване:</label>
                        <select multiple onChange={handleUserSelect} value={selectedUsers}>
                            {users.map((user) => (
                                <option key={user.id} value={user.email}>
                                    {user.email}
                                </option>
                            ))}
                        </select>

                        {/* Manually add a user tag */}
                        <div>
                            <input
                                type="text"
                                value={manualUsernameInput}
                                onChange={(e) => setManualUsernameInput(e.target.value)}
                                placeholder="Отбележи потребител"
                            />
                            <button onClick={addManualUser}>Добави ръчно</button>
                        </div>

                        {/* Comment Input */}
                        <div>
                            <label>Добави коментар:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Добави твоят коментар"
                            ></textarea>
                        </div>

                        {/* Show tagged users with option to remove */}
                        <div>
                            <h3>Отбелязани потребители:</h3>
                            {selectedUsers.length > 0 || manualUsernames.length > 0 ? (
                                <ul>
                                    {selectedUsers.map((user, index) => (
                                        <li key={index}>
                                            {user} <button onClick={() => removeTaggedUser(user)}>Премахни</button>
                                        </li>
                                    ))}
                                    {manualUsernames.map((user, index) => (
                                        <li key={index}>
                                            {user} <button onClick={() => removeTaggedUser(user)}>Премахни</button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No users tagged yet.</p>
                            )}
                        </div>

                        <div className="edit-actions">
                            <button onClick={handleSave}>Запази промените</button>
                            <button onClick={handleDelete} className="delete-button">
                               Изтрий снимка
                            </button>
                            <button onClick={() => navigate('/gallery')}>Откажи</button> {/* Redirect to gallery */}
                        </div>
                    </div>
                </>
            ) : (
                <p>Image not found</p>
            )}
        </div>
    );
}
