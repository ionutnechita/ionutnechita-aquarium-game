import { FishProps } from '@/lib/types';
import { createSketch2D } from './renderers/sketch2D';

export const initializeSketch = (
  p5Module: any,
  container: HTMLDivElement,
  p5InstanceRef: React.MutableRefObject<any>,
  sketchInitializedRef: React.MutableRefObject<boolean>,
  initialWidth: number,
  initialHeight: number,
  playerFish: FishProps,
  aiFishes: FishProps[]
) => {
  if (sketchInitializedRef.current) return;

  const sketch = (p: any) => {
    // Salvăm starea peștilor pentru a fi accesibilă în draw()
    let currentPlayerFish = playerFish;
    let currentAiFishes = aiFishes;
    let currentWidth = initialWidth;
    let currentHeight = initialHeight;

    // Variabile pentru animații
    let bubbles: any[] = [];

    p.setup = () => {
      console.log("P5 setup called with dimensions:", initialWidth, initialHeight);

      // Creăm canvas 2D
      const canvas = p.createCanvas(initialWidth, initialHeight);

      // Asigurăm-ne că stilurile canvas-ului sunt corecte pentru a ocupa tot spațiul
      canvas.style('display', 'block');
      canvas.style('position', 'absolute');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('width', '100%');
      canvas.style('height', '100%');
      canvas.style('z-index', '1');

      p.colorMode(p.HSB, 100);
      p.frameRate(60);

      // Generăm bule
      initializeBubbles();
    };

    // Inițializăm bulele
    const initializeBubbles = () => {
      bubbles = [];
      for (let i = 0; i < 50; i++) {
        bubbles.push({
          x: p.random(currentWidth),
          y: p.random(currentHeight, currentHeight * 1.2),
          z: 0, // Nu mai folosim z în 2D
          size: p.random(2, 8),
          speed: p.random(0.5, 2)
        });
      }
    };

    // Funcție pentru actualizarea dimensiunilor canvas-ului
    p.updateCanvasSize = (newWidth: number, newHeight: number) => {
      if (newWidth !== currentWidth || newHeight !== currentHeight) {
        console.log("Resizing canvas to:", newWidth, newHeight);
        p.resizeCanvas(newWidth, newHeight);
        currentWidth = newWidth;
        currentHeight = newHeight;
        initializeBubbles(); // Reinițializăm bulele pentru noile dimensiuni
      }
    };

    // Handler pentru redimensionarea ferestrei
    p.windowResized = () => {
      if (container) {
        const rect = container.getBoundingClientRect();
        p.updateCanvasSize(rect.width, rect.height);
      }
    };

    // Actualizăm starea peștilor - apelat din exterior
    p.updateFishState = (newPlayerFish: FishProps, newAiFishes: FishProps[]) => {
      currentPlayerFish = newPlayerFish;
      currentAiFishes = newAiFishes;
    };

    p.draw = () => {
      // Folosim funcțiile din modulul sketch2D
      const sketch2D = createSketch2D(p, currentWidth, currentHeight, bubbles);
      sketch2D.drawScene(currentPlayerFish, currentAiFishes);
    };
  };

  // Creăm instanța p5
  p5InstanceRef.current = new p5Module(sketch, container);
  sketchInitializedRef.current = true;
};

