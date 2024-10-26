import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import ImageCard from '../../components/ImageCard/ImageCard';
import './Gallery.css';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageId, setActiveImageId] = useState(null);
    const { user } = useAuthContext();
    const navigate = useNavigate();

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

    const handleLike = async (image) => {
        if (!user) {
            alert('You need to be logged in to like an image.');
            return;
        }

        const imageRef = doc(db, 'images', image.id);
        const userHasLiked = image.likes?.includes(user.uid);

        try {
            if (userHasLiked) {
                // Remove like
                await updateDoc(imageRef, {
                    likes: arrayRemove(user.uid),
                });
                setImages(images.map(img => img.id === image.id ? { ...img, likes: img.likes.filter(uid => uid !== user.uid) } : img));
            } else {
                // Add like
                await updateDoc(imageRef, {
                    likes: arrayUnion(user.uid),
                });
                setImages(images.map(img => img.id === image.id ? { ...img, likes: [...img.likes, user.uid] } : img));
            }
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };

    const handleEdit = (image) => {
        navigate(`/edit/${image.id}`);
    };

    const handleDelete = async (imageId) => {
        try {
            await deleteDoc(doc(db, 'images', imageId));
            setImages(images.filter(img => img.id !== imageId));
            setActiveImageId(null);
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleNextImage = () => {
        const currentIndex = images.findIndex(image => image.id === activeImageId);
        const nextIndex = (currentIndex + 1) % images.length; // Loop back to the first image
        setActiveImageId(images[nextIndex].id);
    };

    const handlePrevImage = () => {
        const currentIndex = images.findIndex(image => image.id === activeImageId);
        const prevIndex = (currentIndex - 1 + images.length) % images.length; // Loop back to the last image
        setActiveImageId(images[prevIndex].id);
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
                        onLike={handleLike}
                    />
                ))
            )}

            {activeImage && (
                <div className="modal" onClick={() => setActiveImageId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-image-container">
                            <button className="arrow left" onClick={handlePrevImage}>
                                &lt;
                            </button>
                            <img src={activeImage.url} alt={activeImage.fileName} className="card__large-image" />
                            <button className="arrow right" onClick={handleNextImage}>
                                &gt;
                            </button>
                        </div>
                        {user?.role === "admin" && (
                            <>
                                <button onClick={() => handleEdit(activeImage)}>Редактирай</button>
                                <button onClick={() => handleDelete(activeImage.id)}>Изтрий</button>
                            </>
                        )}
                        {user ? (
                            <button onClick={() => handleLike(activeImage)}>
                                {activeImage.likes?.includes(user.uid) ? 'Вече не харесвам' : 'Харесвам'}
                            </button>
                        ) : (
                            <p>Регистрирай се за да харесаш</p>
                        )}

                        <button onClick={() => setActiveImageId(null)}>Затвори</button>
                    </div>
                </div>
            )}
        </div>
    );
}
