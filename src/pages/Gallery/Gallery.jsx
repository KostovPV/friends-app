import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ImageCard from '../../components/ImageCard/ImageCard';
import './Gallery.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageId, setActiveImageId] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate(); // Use useNavigate for routing

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imagesCollection = collection(db, 'images');
                const imagesSnapshot = await getDocs(imagesCollection);
                const imagesList = imagesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setImages(imagesList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching images:', error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = (imageId) => {
        setActiveImageId(activeImageId === imageId ? null : imageId);
    };

    const handleEdit = (image) => {
        navigate(`/edit/${image.id}`); // Navigate to edit page with image ID
    };

    const handleDelete = async (imageId) => {
        try {
            await deleteDoc(doc(db, 'images', imageId)); // Delete image from Firestore
            setImages(images.filter(img => img.id !== imageId)); // Remove from local state
            setActiveImageId(null); // Close modal
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    if (loading) {
        return <div>Loading gallery...</div>;
    }

    const activeImage = images.find(image => image.id === activeImageId);

    return (
        <div className="gallery-container">
            {images.length === 0 ? (
                <p>No images available</p>
            ) : (
                images.map((image) => (
                    <ImageCard
                        key={image.id}
                        image={image}
                        isSelected={activeImageId === image.id}
                        user={user}
                        onImageClick={handleImageClick}
                    />
                ))
            )}

            {activeImage && (
                <div className="modal" onClick={() => setActiveImageId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-image-container">
                            <button className="arrow left">&lt;</button>
                            <img src={activeImage.url} alt={activeImage.fileName} className="card__large-image" />
                            <button className="arrow right">&gt;</button>
                        </div>
                        {user?.role === "admin" && (
                            <>
                                <button onClick={() => handleEdit(activeImage)}>Редактирай</button>
                                <button onClick={() => handleDelete(activeImage.id)}>Изтрий</button>
                            </>
                        )}
                        <button onClick={() => setActiveImageId(null)}>Затвори</button>
                    </div>
                </div>
            )}
        </div>
    );
}
