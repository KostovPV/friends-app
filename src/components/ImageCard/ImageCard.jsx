import React from 'react';
import './ImageCard.css';

export default function ImageCard({ image, isSelected, user, onImageClick, onLike }) {
    const totalLikes = image.likes?.length || 0;
    const maxStars = 5;
    const filledStars = Math.min(totalLikes, maxStars); // Cap the number of filled stars at 5

    const renderStars = () => {
        return (
            <div className="stars-container">
                {[...Array(maxStars)].map((_, index) => (
                    <span key={index} className={index < filledStars ? 'star filled' : 'star'}>
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const handleLikeClick = () => {
        if (!user) {
            alert('Трябва да сте регистриран за да харесате снимката.');
            return;
        }
        onLike(image);
    };

    return (
        <div className={`image-card ${isSelected ? 'selected' : ''}`} onClick={() => onImageClick(image.id)}>
            <div className="card">
                <div className="card__body">
                    <img src={image.url} className="card__image" alt={image.fileName} />
                    <div className="card__footer">
                        <div className='card__footer-left'>
                            {renderStars()}
                        </div>
                        {user &&
                            <div className='card__footer-right'>
                                <button onClick={handleLikeClick}>
                                    {image.likes?.includes(user?.uid) ? 'Не харесвам' : 'Харесай'}
                                </button>
                            </div>
                        }


                    </div>
                </div>
            </div>
        </div>
    );
}
