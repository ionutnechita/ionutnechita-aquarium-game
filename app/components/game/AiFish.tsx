"use client"
import React from 'react';
import { FishProps } from '@/lib/types';

export const AiFish: React.FC<FishProps> = ({ x, y, size, color, direction }) => {
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
  };

  const bodyStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
    borderRadius: '70% 40% 40% 70% / 50% 50% 50% 50%',
    position: 'relative',
  };

  const tailStyle = {
    position: 'absolute',
    right: `-${size/5}px`,
    top: '15%',
    width: `${size/3}px`,
    height: `${size/3}px`,
    backgroundColor: color,
    clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
  };

  const eyeStyle = {
    position: 'absolute',
    left: `${size/5}px`,
    top: `${size/6}px`,
    width: `${size/8}px`,
    height: `${size/8}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
  };

  const pupilStyle = {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '50%',
    height: '50%',
    backgroundColor: 'black',
    borderRadius: '50%',
  };

  const topFinStyle = {
    position: 'absolute',
    bottom: '60%',
    left: '40%',
    width: `${size/4}px`,
    height: `${size/4}px`,
    backgroundColor: color,
    opacity: 0.7,
    clipPath: 'polygon(0 100%, 100% 100%, 50% 0)',
  };

  const sideFinStyle = {
    position: 'absolute',
    top: '60%',
    left: '30%',
    width: `${size/5}px`,
    height: `${size/6}px`,
    backgroundColor: color,
    opacity: 0.7,
    clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
  };

  return (
    <div style={fishStyle} suppressHydrationWarning={true} >
      <div style={bodyStyle} suppressHydrationWarning={true} >
        <div style={tailStyle} suppressHydrationWarning={true} />
        <div style={eyeStyle} suppressHydrationWarning={true} >
          <div style={pupilStyle} />
        </div>
        <div style={topFinStyle} suppressHydrationWarning={true} />
        <div style={sideFinStyle} suppressHydrationWarning={true} />
      </div>
    </div>
  );
};

