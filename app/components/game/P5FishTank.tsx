"use client";
import React, { useRef, useEffect, useState } from 'react';
import { FishProps } from '@/lib/types';
import { initializeSketch } from './sketch-initializer';

interface P5FishTankProps {
  width: number;
  height: number;
  playerFish: FishProps;
  aiFishes: FishProps[];
}

export const P5FishTank: React.FC<P5FishTankProps> = ({ width, height, playerFish, aiFishes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<any | null>(null);
  const sketchInitializedRef = useRef<boolean>(false);

  // Folosim un efect separat pentru a încărca p5.js
  useEffect(() => {
    let p5Module: any = null;

    // Încărcăm dinamic doar p5.js
    const loadP5 = async () => {
      try {
        const p5Import = await import('p5');
        p5Module = p5Import.default;

        // Verificăm dacă componenta este încă montată
        if (containerRef.current && !sketchInitializedRef.current) {
          // Nu mai încercăm să încărcăm PCL.js deoarece pare să fie problematic
          // În schimb, folosim doar p5.js pentru grafica avansată
          initializeSketch(
            p5Module,
            containerRef.current,
            p5InstanceRef,
            sketchInitializedRef,
            width,
            height,
            playerFish,
            aiFishes
          );
        }
      } catch (err) {
        console.error("Error loading p5.js:", err);
      }
    };

    loadP5();

    // Funcția de cleanup
    return () => {
      if (p5InstanceRef.current) {
        console.log("Removing p5 instance");
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      sketchInitializedRef.current = false;
    };
  }, []);

  // Efect separat pentru a actualiza dimensiunile și peștii
  useEffect(() => {
    // Verificăm mai întâi dacă p5InstanceRef.current există
    const p5Instance = p5InstanceRef.current;
    if (!p5Instance) return;

    // Actualizăm starea peștilor dacă avem o instanță p5 cu metoda updateFishState
    if (typeof p5Instance.updateFishState === 'function') {
      p5Instance.updateFishState(playerFish, aiFishes);
    }

    // Apoi verificăm dacă dimensiunile s-au schimbat și actualizăm
    if (typeof p5Instance.updateCanvasSize === 'function') {
      p5Instance.updateCanvasSize(width, height);
    }
  }, [width, height, playerFish, aiFishes]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: 'relative' }}
    />
  );
};
