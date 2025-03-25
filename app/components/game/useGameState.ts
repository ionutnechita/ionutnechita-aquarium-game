"use client"
// /components/game/useGameState.ts
import { useState, useEffect, useCallback } from 'react';
import { FishProps, GameState } from '@/lib/types';
import { getRandomPosition, getRandomColor, getRandomSize, getRandomSpeed, getRandomDirection, calculateDistance, canEat } from '@/app/lib/utils';
import { useSound } from './useSound';

export const useGameState = (containerWidth: number, containerHeight: number) => {
  const { playEatSound, playGameOverSound, playVictorySound } = useSound();
  const [gameState, setGameState] = useState<GameState>(() => {
    // Inițializarea jocului cu 30 de pești AI și 1 jucător
    const initialPlayerFish: FishProps = {
      id: 0,
      x: containerWidth / 2,
      y: containerHeight / 2,
      size: 20,
      speed: 2,
      color: '#FF4757',
      direction: 0,
      isPlayer: true
    };

    const initialAiFishes: FishProps[] = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      size: getRandomSize(),
      speed: getRandomSpeed(),
      color: getRandomColor(),
      direction: getRandomDirection(),
      isPlayer: false
    }));

    return {
      playerFish: initialPlayerFish,
      aiFishes: initialAiFishes,
      score: 0,
      gameOver: false
    };
  });

  const [prevFishCount, setPrevFishCount] = useState(gameState.aiFishes.length);
  const [prevGameOver, setPrevGameOver] = useState(gameState.gameOver);

  useEffect(() => {
    // Verificăm dacă a fost mâncat un pește
    if (gameState.aiFishes.length < prevFishCount) {
      playEatSound();
    }

    // Verificăm dacă jocul s-a terminat
    if (gameState.gameOver && !prevGameOver) {
      if (gameState.aiFishes.length === 0) {
        playVictorySound();
      } else {
        playGameOverSound();
      }
    }

    setPrevFishCount(gameState.aiFishes.length);
    setPrevGameOver(gameState.gameOver);
  }, [gameState.aiFishes.length, gameState.gameOver, prevFishCount, prevGameOver, playEatSound, playGameOverSound, playVictorySound]);

  const movePlayerFish = useCallback((x: number, y: number) => {
    setGameState(prevState => {
      // Evităm actualizările mici pentru a reduce numărul de re-randări
      if (Math.abs(x - prevState.playerFish.x) < 2 && Math.abs(y - prevState.playerFish.y) < 2) {
        return prevState; // Returnăm starea anterioară fără modificări
      }

      // Calculăm direcția către noua poziție
      const dx = x - prevState.playerFish.x;
      const dy = y - prevState.playerFish.y;
      const direction = Math.atan2(dy, dx);

      // Actualizăm poziția peștelui jucător
      const updatedPlayerFish = {
        ...prevState.playerFish,
        x,
        y,
        direction
      };

      return {
        ...prevState,
        playerFish: updatedPlayerFish
      };
    });
  }, []);

  const updateGame = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver) return prevState;

      // Actualizăm poziția peștilor AI
      const updatedAiFishes = prevState.aiFishes.map(fish => {
        // Calculăm noua poziție
        let newX = fish.x + Math.cos(fish.direction) * fish.speed;
        let newY = fish.y + Math.sin(fish.direction) * fish.speed;
        let newDirection = fish.direction;

        // Verificăm coliziunea cu marginile și schimbăm direcția dacă e necesar
        if (newX < 0 || newX > containerWidth) {
          newDirection = Math.PI - newDirection;
          newX = Math.max(0, Math.min(containerWidth, newX));
        }
        if (newY < 0 || newY > containerHeight) {
          newDirection = -newDirection;
          newY = Math.max(0, Math.min(containerHeight, newY));
        }

        // Ocazional schimbăm direcția pentru a face mișcarea mai naturală
        if (Math.random() < 0.02) {
          newDirection = getRandomDirection();
        }

        return {
          ...fish,
          x: newX,
          y: newY,
          direction: newDirection
        };
      });

      // Verificăm dacă jucătorul poate mânca vreun pește
      let newScore = prevState.score;
      let playerSize = prevState.playerFish.size;
      const remainingFishes = updatedAiFishes.filter(fish => {
        const distance = calculateDistance(prevState.playerFish, fish);
        const canPlayerEat = canEat(prevState.playerFish, fish);

        if (distance < (prevState.playerFish.size + fish.size) / 2 && canPlayerEat) {
          // Jucătorul mănâncă peștele și crește
          newScore += 1;
          playerSize += fish.size * 0.1; // Creștere proporțională cu mărimea prăzii
          return false;
        }
        return true;
      });

      // Verificăm dacă vreun pește AI poate mânca jucătorul
      const playerEaten = updatedAiFishes.some(fish => {
        const distance = calculateDistance(fish, prevState.playerFish);
        return distance < (fish.size + prevState.playerFish.size) / 2 && canEat(fish, prevState.playerFish);
      });

      // Actualizăm mărimea jucătorului
      const updatedPlayerFish = {
        ...prevState.playerFish,
        size: playerSize
      };

      return {
        playerFish: updatedPlayerFish,
        aiFishes: remainingFishes,
        score: newScore,
        gameOver: playerEaten || remainingFishes.length === 0
      };
    });
  }, [containerWidth, containerHeight]);

  const resetGame = useCallback(() => {
    setGameState(prevState => {
      const initialPlayerFish: FishProps = {
        id: 0,
        x: containerWidth / 2,
        y: containerHeight / 2,
        size: 20,
        speed: 2,
        color: '#FF4757',
        direction: 0,
        isPlayer: true
      };

      const initialAiFishes: FishProps[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: getRandomSize(),
        speed: getRandomSpeed(),
        color: getRandomColor(),
        direction: getRandomDirection(),
        isPlayer: false
      }));

      return {
        playerFish: initialPlayerFish,
        aiFishes: initialAiFishes,
        score: 0,
        gameOver: false
      };
    });
  }, [containerWidth, containerHeight]);

  return {
    gameState,
    movePlayerFish,
    updateGame,
    resetGame
  };
};
