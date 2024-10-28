import React, { useState, useEffect } from 'react';
import './Slider.css';

import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

// Load the first image locally for faster initial rendering
import firstImage from "../../assets/images/1_cropped.webp"; 

export default function Slider() {
  const [images, setImages] = useState([firstImage]); // Initialize with the first image
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to load remaining images from Firebase Storage
  useEffect(() => {
    const storage = getStorage();
    const loadImages = async () => {
      const listRef = ref(storage, 'imagesOnLoad/'); 
      try {
        const response = await listAll(listRef);
        const urls = await Promise.all(response.items.map(item => getDownloadURL(item)));
        setImages(prevImages => [...prevImages, ...urls]); 
      } catch (error) {
        console.error("Error loading images from Firebase Storage:", error);
      }
    };
    loadImages();
  }, []);

  // Handlers for slide navigation
  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="slider-component">
      <div className="slider">
        <div className="arrow left-arrow" onClick={goToPrevSlide}>
          &#10094;
        </div>
        <div className="slider-image">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              loading={index === currentIndex ? "eager" : "lazy"}
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            />
          ))}
        </div>
        <div className="arrow right-arrow" onClick={goToNextSlide}>
          &#10095;
        </div>
        <div className="dots-container">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
