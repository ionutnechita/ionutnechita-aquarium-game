"use client"
import React from 'react';
import { FishProps } from '@/lib/types';

export const PlayerFish: React.FC<FishProps> = ({ x, y, size, color, direction }) => {
  // Calculăm unghiul de rotație în grade
  const rotationDeg = (direction * 180 / Math.PI) + 
    (direction > Math.PI / 2 && direction < 3 * Math.PI / 2 ? 180 : 0);

  // Definim toate stilurile calculate în JavaScript înainte de a le folosi în JSX
  const fishStyle = {
    position: 'absolute',
    left: `${x - size/2}px`,
    top: `${y - size/4}px`,
    width: `${size}px`,
    height: `${size/2}px`,
    transform: `rotate(${rotationDeg}deg)`,
    transition: 'transform 0.1s ease-out',
    zIndex: 10,
  };

  const bodyStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
    borderRadius: '70% 40% 40% 70% / 50% 50% 50% 50%',
    position: 'relative',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
    animation: 'pulse 1.5s infinite alternate',
  };

  const tailStyle = {
    position: 'absolute',
    right: `-${size/5}px`,
    top: '15%',
    width: `${size/3}px`,
    height: `${size/3}px`,
    backgroundColor: color,
    clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
    animation: 'tailWag 0.3s infinite alternate',
  };

  const eyeStyle = {
    position: 'absolute',
    left: `${size/5}px`,
    top: `${size/6}px`,
    width: `${size/6}px`,
    height: `${size/6}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const pupilStyle = {
    width: '50%',
    height: '50%',
    backgroundColor: 'black',
    borderRadius: '50%',
  };

  const topFinStyle = {
    position: 'absolute',
    top: `-${size/6}px`,
    left: `${size/3}px`,
    width: `${size/3}px`,
    height: `${size/3}px`,
    backgroundColor: color,
    clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
    opacity: 0.8,
  };

  const sideFinStyle = {
    position: 'absolute',
    top: '40%',
    left: `${size/3}px`,
    width: `${size/5}px`,
    height: `${size/4}px`,
    backgroundColor: color,
    clipPath: 'polygon(0 50%, 100% 0, 100% 100%)',
    opacity: 0.8,
    transform: 'rotate(-30deg)',
  };

  // Generăm bule doar pe partea client
  const bubbles = Array.from({ length: 3 }).map((_, i) => ({
    key: i,
    left: `-${20 + i * 10}px`,
    top: `${10 + i * 10}px`,
    width: `${5 + i}px`,
    height: `${5 + i}px`,
    opacity: 0.7 - i * 0.2,
    animationDuration: `${1 + i * 0.5}s`,
  }));

  return (
    <div style={fishStyle}>
      <div style={bodyStyle}>
        <div style={tailStyle} />
        <div style={eyeStyle}>
          <div style={pupilStyle} />
        </div>
        <div style={topFinStyle} />
        <div style={sideFinStyle} />
      </div>
      
      <div className="bubbles">
        {bubbles.map((bubble) => (
          <div
            key={bubble.key}
            style={{
              position: 'absolute',
              left: bubble.left,
              top: bubble.top,
              width: bubble.width,
              height: bubble.height,
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '50%',
              opacity: bubble.opacity,
              animation: `rise ${bubble.animationDuration} infinite linear`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

