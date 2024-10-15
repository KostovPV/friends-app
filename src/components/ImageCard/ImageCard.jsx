import React from 'react';
import './ImageCard.css';

export default function ImageCard({ image, isSelected, isActive, onClick }) {
    return (
        <div
            className={`image-card ${isSelected ? 'selected' : (isActive ? 'blurred' : '')}`} 
            
            onClick={onClick} 
        >
            <div className="card">
                <div className="card__body">
                    <img src={image.url} className="card__image" alt={image.fileName} />
                </div>
            </div>
        </div>
    );
}
