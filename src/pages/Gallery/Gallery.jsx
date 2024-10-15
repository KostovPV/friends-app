import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Adjust the path if necessary
import ImageCard from '../../components/ImageCard/ImageCard'; // Import the ImageCard component
import './Gallery.css'; // Add styling for the gallery if necessary

export default function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImageId, setActiveImageId] = useState(null); // State for the active image

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

    // Navigate to the previous image
    const goToPreviousImage = () => {
        if (activeImageId) {
            const currentIndex = images.findIndex(image => image.id === activeImageId);
            const previousIndex = (currentIndex - 1 + images.length) % images.length; // Loop to the end if at start
            setActiveImageId(images[previousIndex].id);
        }
    };

    // Navigate to the next image
    const goToNextImage = () => {
        if (activeImageId) {
            const currentIndex = images.findIndex(image => image.id === activeImageId);
            const nextIndex = (currentIndex + 1) % images.length; // Loop to the start if at end
            setActiveImageId(images[nextIndex].id);
        }
    };

    if (loading) {
        return <div>Loading gallery...</div>;
    }

    // Find the currently active image based on the activeImageId state
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
                        isSelected={activeImageId === image.id} // Pass the active state
                        onClick={() => handleImageClick(image.id)} // Handle clicks
                    />
                ))
            )}

            {/* Modal overlay for details */}
            {activeImage && (
                <div className="modal" onClick={() => setActiveImageId(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-image-container">
                            <button className="arrow left" onClick={goToPreviousImage}>&lt;</button>
                            <img src={activeImage.url} alt={activeImage.fileName} className="card__large-image" />
                            <button className="arrow right" onClick={goToNextImage}>&gt;</button>
                        </div>
                        <p><strong>Отбелязани:</strong> {Array.isArray(activeImage.taggedUsers) ? activeImage.taggedUsers.join(', ') : 'Няма отбелязани'}</p>
                        <p><strong>Коментар:</strong> {activeImage.comment || 'Без добавени кометари'}</p>
                        <p><strong>Харесвания:</strong> {Array.isArray(activeImage.likes) ? activeImage.likes.length : 0} харесвания</p>
                        <p><strong>Създадена на:</strong> {activeImage.createdAt?.seconds ? new Date(activeImage.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}</p>
                        <button onClick={() => setActiveImageId(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
