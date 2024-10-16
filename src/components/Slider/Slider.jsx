import React, { useState } from 'react';
import './Slider.css';

import kid1 from "../../assets/images/valq1.jpg";
import kid2 from "../../assets/images/kids10.jpg";
import kid3 from "../../assets/images/kids12.jpg";
import kid4 from "../../assets/images/valq6.jpg";
import kid5 from "../../assets/images/kids11.jpg";
import kid6 from "../../assets/images/valq10.jpg";
import kid7 from "../../assets/images/kids13.jpg";

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
