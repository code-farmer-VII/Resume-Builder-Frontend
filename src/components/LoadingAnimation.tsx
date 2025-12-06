import React from 'react';
import './LoadingAnimation.css';

export const LoadingAnimation: React.FC = () => (
  <div className="loading-container">
    <div className="swiper-animation">
      <img 
        src="/logo.webp" 
        alt="Khilx Academy Logo" 
        className="loading-logo"
      />
      <div className="orbit-dot"></div>
      <div className="orbit-dot"></div>
      <div className="orbit-dot"></div>
      <div className="orbit-dot"></div>
    </div>
  </div>
);
