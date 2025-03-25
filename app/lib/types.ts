// /lib/types.ts - Definirea tipurilor pentru joc
export interface GameState {
  playerFish: FishProps;
  aiFishes: FishProps[];
  score: number;
  gameOver: boolean;
}

export interface FishProps {
  id?: string;
  x: number;
  y: number;
  size: number;
  speed?: number;
  direction: number;
  color: string;
  type?: string;
  isPlayer?: boolean;
}

export interface BubbleProps {
  x: number;
  y: number;
  z?: number;
  size: number;
  speed: number;
}

export interface P5SketchProps {
  width: number;
  height: number;
  use3D?: boolean;
}

export interface SketchRenderer {
  drawScene: (playerFish: FishProps, aiFishes: FishProps[]) => void;
  drawBackground: () => void;
  drawFish: (fish: FishProps, isPlayer: boolean) => void;
  drawBubbles: () => void;
  drawWaterSurface: () => void;
}
