import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig'; // Adjust path as needed
import { db } from '../../firebaseConfig'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions

export default function Upload() {
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setError("Invalid file type. Please select a JPEG, PNG, or GIF image.");
                setImageFile(null);
                return;
            }
            setError("");
            setImageFile(file);
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

                // Store the image URL in Firestore
                await addDoc(collection(db, 'images'), { // Replace 'images' with your desired collection name
                    url: downloadUrl,
                    fileName: imageFile.name,
                    createdAt: new Date()
                });

                console.log('File available at:', downloadUrl);
            } catch (error) {
                console.error('Error uploading file:', error);
                setError("Error uploading file: " + error.message); // Set error state
            } finally {
                setLoading(false); // Reset loading state
            }
        } else {
            setError('No file selected');
        }
    };

    return (
        <div>
            <h2>Upload an Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={uploadImage} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {imageUrl && (
                <div>
                    <h3>Uploaded Image:</h3>
                    <img src={imageUrl} alt="Uploaded file" width="200" />
                </div>
            )}
        </div>
    );
}
