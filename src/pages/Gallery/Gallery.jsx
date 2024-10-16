import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust the path if necessary
import ImageCard from '../../components/ImageCard/ImageCard'; // Import the ImageCard component
import './Gallery.css'; // Add styling for the gallery if necessary
import { useAuthContext } from '../../hooks/useAuthContext';

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageId, setActiveImageId] = useState(null); 
    const { user  } = useAuthContext(); // Get user from context

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
        setActiveImageId(activeImageId === imageId ? null : imageId); // Toggle active image
    };

    const goToPreviousImage = () => {
        if (activeImageId) {
            const currentIndex = images.findIndex(image => image.id === activeImageId);
            const previousIndex = (currentIndex - 1 + images.length) % images.length;
            setActiveImageId(images[previousIndex].id);
        }
    };

    const goToNextImage = () => {
        if (activeImageId) {
            const currentIndex = images.findIndex(image => image.id === activeImageId);
            const nextIndex = (currentIndex + 1) % images.length;
            setActiveImageId(images[nextIndex].id);
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
                        onClick={() => handleImageClick(image.id)}
                    />
                ))
            )}

            {activeImage && (
                <div className="modal" onClick={() => setActiveImageId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-image-container">
                            <button className="arrow left" onClick={goToPreviousImage}>&lt;</button>
                            <img src={activeImage.url} alt={activeImage.fileName} className="card__large-image" />
                            <button className="arrow right" onClick={goToNextImage}>&gt;</button>
                        </div>

                        {/* Show the following details only if the user is logged in */}
                        {user ? (
                            <>
                                <p><strong>Отбелязани:</strong> {Array.isArray(activeImage.taggedUsers) ? activeImage.taggedUsers.join(', ') : 'Няма отбелязани'}</p>
                                <p><strong>Коментар:</strong> {activeImage.comment || 'Без добавени кометари'}</p>
                                <p><strong>Харесвания:</strong> {Array.isArray(activeImage.likes) ? activeImage.likes.length : 0} харесвания</p>
                                <p><strong>Създадена на:</strong> {activeImage.createdAt?.seconds ? new Date(activeImage.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}</p>
                            </>
                        ) : (
                            <p>Трябва да сте регистриран за да видите детайли за снимката.</p>
                        )}

                        <button onClick={() => setActiveImageId(null)}>Затвори</button>
                    </div>
                </div>
            )}
        </div>
    );
}
