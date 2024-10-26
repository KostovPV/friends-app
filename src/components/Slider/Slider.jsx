import React, { useState } from 'react';
import './Slider.css';

import kid1 from "../../assets/images/valq1.webp";
import kid2 from "../../assets/images/kids10.webp";
import kid3 from "../../assets/images/kids12.webp";
import kid4 from "../../assets/images/valq6.webp";
import kid5 from "../../assets/images/kids11.webp";
import kid6 from "../../assets/images/valq10.webp";
import kid7 from "../../assets/images/kids13.webp";

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
        <div
          className="slider-image"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        ></div>
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
