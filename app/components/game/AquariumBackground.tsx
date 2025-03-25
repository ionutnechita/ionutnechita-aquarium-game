"use client"
// /components/game/AquariumBackground.tsx
import React, { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
}

interface WaterPlant {
  id: number;
  x: number;
  height: number;
  width: number;
  color: string;
  swayAmount: number;
}

interface AquariumBackgroundProps {
  width: number;
  height: number;
}

export const AquariumBackground: React.FC<AquariumBackgroundProps> = ({ width, height }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [plants, setPlants] = useState<WaterPlant[]>([]);
  const [randomStyles, setRandomStyles] = useState({
    gradientPos1: "30%",
    gradientPos2: "70%",
  });
  
  // Generăm bule aleatorii
  useEffect(() => {
    // Generează valori aleatorii pentru stiluri
    setRandomStyles({
      gradientPos1: `${Math.floor(Math.random() * 100)}%`,
      gradientPos2: `${Math.floor(Math.random() * 100)}%`,
    });
    
    const bubbleCount = Math.floor(width / 50); // O bulă la fiecare ~50px
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < bubbleCount; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * width,
        y: height + Math.random() * 50, // Pornesc de sub acvariu
        size: Math.random() * 8 + 2, // Între 2px și 10px
        speed: Math.random() * 2 + 1, // Între 1 și 3
        delay: Math.random() * 10 // Delay aleatoriu pentru animație
      });
    }
    
    setBubbles(newBubbles);
    
    // Generăm plante acvatice
    const plantCount = Math.floor(width / 150); // Mai puține plante
    const newPlants: WaterPlant[] = [];
    
    const plantColors = [
      '#0d9b76', '#0a8967', '#06725c', '#0b9e5f', '#085c43', '#128470'
    ];
    
    for (let i = 0; i < plantCount; i++) {
      newPlants.push({
        id: i,
        x: Math.random() * width,
        height: Math.random() * (height * 0.4) + (height * 0.2), // Între 20% și 60% din înălțimea acvariului
        width: Math.random() * 20 + 10, // Lățime între 10px și 30px
        color: plantColors[Math.floor(Math.random() * plantColors.length)],
        swayAmount: Math.random() * 10 + 5 // Cantitatea de legănare
      });
    }
    
    setPlants(newPlants);
  }, [width, height]);
  
  // Animăm bulele
  useEffect(() => {
    const moveBubbles = () => {
      setBubbles(prevBubbles => 
        prevBubbles.map(bubble => {
          let newY = bubble.y - bubble.speed;
          
          // Resetăm bula dacă a ieșit din acvariu
          if (newY < -20) {
            newY = height + Math.random() * 20;
          }
          
          return {
            ...bubble,
            y: newY,
            x: bubble.x + Math.sin(newY / 30) * 0.5 // Adăugăm mișcare ușoară stânga-dreapta
          };
        })
      );
    };
    
    const animationFrame = setInterval(moveBubbles, 50);
    return () => clearInterval(animationFrame);
  }, [height]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fundul acvariului - pietriș */}
      <div 
        className="absolute bottom-0 w-full"
        style={{ 
          height: '10%', 
          background: 'linear-gradient(to bottom, #95735c 0%, #b5967c 100%)',
          backgroundImage: `radial-gradient(circle at ${randomStyles.gradientPos1} ${randomStyles.gradientPos2}, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%), radial-gradient(circle at ${randomStyles.gradientPos2} ${randomStyles.gradientPos1}, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)`,
          backgroundSize: '10px 10px'
        }}
      />
      
      {/* Plante acvatice */}
      {plants.map(plant => (
        <div 
          key={`plant-${plant.id}`}
          style={{
            position: 'absolute',
            bottom: 0,
            left: plant.x,
            width: plant.width,
            height: plant.height,
            backgroundColor: plant.color,
            borderRadius: '100% 100% 0 0 / 50% 50% 0 0',
            transformOrigin: 'bottom center',
            animation: `sway ${2 + plant.swayAmount / 5}s ease-in-out infinite alternate`,
            zIndex: 1
          }}
        >
          {/* Detalii ale plantei */}
          <div 
            style={{
              position: 'absolute',
              top: '10%',
              left: '20%',
              width: '60%',
              height: '70%',
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '0 100% 100% 0 / 0 50% 50% 0',
              transform: 'rotate(10deg)'
            }}
          />
        </div>
      ))}
      
      {/* Bule de aer */}
      {bubbles.map(bubble => (
        <div
          key={`bubble-${bubble.id}`}
          style={{
            position: 'absolute',
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset -1px -1px 1px rgba(0, 0, 0, 0.1), inset 1px 1px 1px rgba(255, 255, 255, 0.3)',
            animationDelay: `${bubble.delay}s`,
            zIndex: 2
          }}
        />
      ))}
      
      {/* Reflexii de lumină pe suprafața apei */}
      <div 
        className="absolute top-0 left-0 right-0"
        style={{
          height: '5%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
          opacity: 0.7,
          animation: 'shimmer 5s infinite alternate'
        }}
      />
      
      {/* Decorațiuni suplimentare - pietre */}
      <div 
        className="absolute bottom-0 left-1/4 w-16 h-10 rounded-full"
        style={{ 
          backgroundColor: '#777',
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.2) 100%)',
          transform: 'rotate(10deg)',
          zIndex: 1
        }}
      />
      
      <div 
        className="absolute bottom-0 right-1/3 w-20 h-8 rounded-full"
        style={{ 
          backgroundColor: '#888',
          backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.2) 100%)',
          transform: 'rotate(-15deg)',
          zIndex: 1
        }}
      />
    </div>
  );
};

