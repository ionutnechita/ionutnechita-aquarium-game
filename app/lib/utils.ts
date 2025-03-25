// /lib/utils.ts - Utilități pentru joc
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FishProps } from './types';

// Funcție pentru combinarea claselor Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Funcții pentru jocul cu pești
export function getRandomPosition(maxX: number, maxY: number) {
  return {
    x: Math.random() * maxX,
    y: Math.random() * maxY
  };
}

export function getRandomColor() {
  const colors = ['#FF6B6B', '#48DBFB', '#1DD1A1', '#FECA57', '#54A0FF', '#5F27CD'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomSize() {
  // Între 10 și 30
  return Math.random() * 20 + 10;
}

export function getRandomSpeed() {
  // Între 0.5 și 2
  return Math.random() * 1.5 + 0.5;
}

export function getRandomDirection() {
  return Math.random() * Math.PI * 2;
}

export function calculateDistance(fish1: FishProps, fish2: FishProps) {
  const dx = fish1.x - fish2.x;
  const dy = fish1.y - fish2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function canEat(predator: FishProps, prey: FishProps) {
  // Un pește poate mânca alt pește dacă este cu 20% mai mare
  return predator.size > prey.size * 1.2;
}

