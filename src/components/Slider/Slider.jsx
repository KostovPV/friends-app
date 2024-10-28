import React, { useState } from 'react';
import './Slider.css';

import kid1 from "../../assets/images/1_cropped.webp";
import kid2 from "../../assets/images/2_cropped.webp";
import kid3 from "../../assets/images/4_cropped.webp";
import kid4 from "../../assets/images/5_cropped.webp";
import kid5 from "../../assets/images/6_cropped.webp";
import kid6 from "../../assets/images/7_cropped.webp";
import kid7 from "../../assets/images/8_cropped.webp";

const images = [kid1, kid2, kid3, kid4, kid5, kid6, kid7];

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);

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
