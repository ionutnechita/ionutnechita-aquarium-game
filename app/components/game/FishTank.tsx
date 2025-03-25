"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useGameState } from './useGameState';
import { P5FishTank } from './P5FishTank';
import { PlayerFish } from './PlayerFish';
import { AiFish } from './AiFish';
import { AquariumBackground } from './AquariumBackground';
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

export const FishTank: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { gameState, movePlayerFish, updateGame, resetGame } = useGameState(dimensions.width, dimensions.height);
  const [showStartDialog, setShowStartDialog] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [useP5Rendering, setUseP5Rendering] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    let gameLoop: NodeJS.Timeout;

    if (!showStartDialog) {
      gameLoop = setInterval(() => {
        updateGame();
      }, 1000 / 60); // 60 FPS
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [showStartDialog]);

  const mouseMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (gameState.gameOver) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Stocăm poziția curentă a mouse-ului
    lastMousePosRef.current = { x, y };

    // Implementăm throttling pentru a limita actualizările
    if (!mouseMoveTimeoutRef.current) {
      mouseMoveTimeoutRef.current = setTimeout(() => {
        // Folosim poziția din referință pentru a ne asigura că avem cea mai recentă poziție
        movePlayerFish(lastMousePosRef.current.x, lastMousePosRef.current.y);
        mouseMoveTimeoutRef.current = null;
      }, 16); // ~60fps
    }
  };

  useEffect(() => {
    return () => {
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, []);

  const handleTouchMove = (event: React.TouchEvent) => {
    if (gameState.gameOver || showStartDialog) return;

    const touch = event.touches[0];
    const rect = containerRef.current!.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    movePlayerFish(x, y);

    // Prevenim comportamentul implicit pentru a evita scrollul paginii
    event.preventDefault();
  };

  const startGame = () => {
    setShowStartDialog(false);
    resetGame();
  };

  const restartGame = () => {
    resetGame();
  };

  const toggleRendering = () => {
    setUseP5Rendering(!useP5Rendering);
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-[80vh] bg-blue-900 overflow-hidden cursor-none rounded-lg shadow-lg"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Folosim P5FishTank pentru rendering */}
        {useP5Rendering ? (
          <P5FishTank
            width={dimensions.width}
            height={dimensions.height}
            playerFish={gameState.playerFish}
            aiFishes={gameState.aiFishes}
          />
        ) : (
          <>
            {/* Alternativ folosim metoda veche de rendering */}
            <AquariumBackground width={dimensions.width} height={dimensions.height} />

            {/* Pești AI */}
            {gameState.aiFishes.map(fish => (
              <AiFish key={fish.id} {...fish} />
            ))}

            {/* Peștele jucător */}
            <PlayerFish {...gameState.playerFish} />
          </>
        )}

        {/* Overlay game over */}
        {gameState.gameOver && !showStartDialog && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20">
            <h2 className="text-4xl font-bold text-white mb-4">
              {gameState.aiFishes.length === 0 ? 'Ai câștigat!' : 'Game Over'}
            </h2>
            <p className="text-xl text-white mb-2">Scor: {gameState.score}</p>
            <p className="text-lg text-white mb-6">Mărime finală: {Math.round(gameState.playerFish.size)}</p>
            <Button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              onClick={restartGame}
            >
              Joacă din nou
            </Button>
          </div>
        )}

        {/* UI pentru scor și mărime */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded z-10">
          Scor: {gameState.score}
        </div>

        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded z-10">
          Mărime: {Math.round(gameState.playerFish.size)}
        </div>

        {/* Butoane de ajutor, toggle și muzică */}
        <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-black bg-opacity-50 text-white border-white"
            onClick={() => setShowTutorial(true)}
          >
            Ajutor
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-black bg-opacity-50 text-white border-white"
            onClick={toggleRendering}
          >
            {useP5Rendering ? 'Grafică simplă' : 'Grafică avansată'}
          </Button>
        </div>
      </div>

      {/* Dialog de start */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bine ai venit la Acvariul Interactiv!</DialogTitle>
            <DialogDescription>
              Pregătește-te să explorezi acvariul și să devii cel mai mare pește!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-medium mb-2">Cum se joacă:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mișcă mouse-ul pentru a controla peștele tău</li>
              <li>Mănâncă pești mai mici pentru a crește</li>
              <li>Evită peștii mai mari - te pot mânca!</li>
              <li>Scopul este să mănânci toți cei 30 de pești</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={startGame}>Începe jocul</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog tutorial */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cum se joacă</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Mișcare:</strong> Deplasează mouse-ul în acvariu pentru a controla peștele tău</li>
              <li><strong>Creștere:</strong> Mănâncă pești mai mici pentru a crește în dimensiune</li>
              <li><strong>Pericol:</strong> Evită peștii mai mari care te pot mânca</li>
              <li><strong>Scopul jocului:</strong> Mănâncă toți cei 30 de pești pentru a câștiga</li>
              <li><strong>Indiciu:</strong> Cu cât ești mai mare, cu atât poți mânca pești mai mari</li>
              <li><strong>Mod grafic:</strong> Poți schimba între grafică simplă și avansată folosind butonul din colțul din dreapta jos</li>
            </ul>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTutorial(false)}>Am înțeles</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 text-center">
        <p className="text-lg">
          {showStartDialog ?
            "Apasă butonul \"Începe jocul\" pentru a începe" :
            "Mișcă mouse-ul pentru a controla peștele. Mănâncă pești mai mici pentru a crește."
          }
        </p>
      </div>
    </div>
  );
};
