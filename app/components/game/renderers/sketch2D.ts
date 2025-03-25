import { FishProps } from '@/lib/types';

export const createSketch2D = (p: any, width: number, height: number, bubbles: any[]) => {
  // Funcții de desenare pentru modul 2D
  
  const drawBackground = () => {
    // Gradient de adâncime simplificat
    p.noStroke();
    const topColor = p.color(210, 60, 90);
    const bottomColor = p.color(210, 90, 40);

    for (let y = 0; y < height; y += 10) { // Desenăm benzi de 10px pentru performanță
      const inter = p.map(y, 0, height, 0, 1);
      const c = p.lerpColor(topColor, bottomColor, inter);
      p.fill(c);
      p.rect(0, y, width, 10);
    }

    // Raze de lumină - mai puține și mai transparente
    p.fill(210, 10, 100, 3);
    for (let i = 0; i < 6; i++) {
      const x = width * (i / 6 + p.sin(p.frameCount * 0.005 + i) * 0.03);
      p.beginShape();
      p.vertex(x - 20, 0);
      p.vertex(x + 20, 0);
      p.vertex(x + 80 + p.sin(p.frameCount * 0.002) * 30, height);
      p.vertex(x - 80 + p.sin(p.frameCount * 0.002) * 30, height);
      p.endShape(p.CLOSE);
    }

    // Pietriș la fund - cu dimensiune fixă
    p.fill(30, 20, 70);
    p.rect(0, height - 20, width, 20);

    // Folosim un seed constant pentru reproducere consistentă
    p.randomSeed(1);
    for (let i = 0; i < width; i += 10) {
      p.fill(p.random(20, 40), p.random(10, 30), p.random(60, 80));
      p.ellipse(i, height - p.random(5, 15), p.random(3, 8), p.random(2, 6));
    }

    // Plante
    drawPlants();

    // Bule
    drawBubbles();
  };

  const drawPlants = () => {
    // Desenăm câteva plante acvatice, distribuite uniform
    p.randomSeed(42); // seed fix pentru consistență
    const numPlants = 5; // Număr fix de plante

    for (let i = 0; i < numPlants; i++) {
      const plantX = width * ((i + 0.5) / numPlants); // Distribuție uniformă
      const plantHeight = height * 0.25 + p.sin(i * 5) * 15; // Înălțime proporțională
      drawPlant(plantX, height, plantHeight);
    }
  };

  const drawPlant = (x: number, bottom: number, plantHeight: number) => {
    const stemWidth = 5;
    const stemColor = p.color(120, 70, 60);
    const leafColor = p.color(120, 90, 70);

    // Desenăm tulpina
    p.fill(stemColor);

    // Tulpina cu mișcare
    const waveAmount = p.sin(p.frameCount * 0.03) * 8;
    p.beginShape();
    for (let y = 0; y < plantHeight; y += 10) {
      const xOffset = p.sin((y / plantHeight) * p.PI + p.frameCount * 0.02) * 8 + waveAmount;
      p.curveVertex(x + xOffset, bottom - y);
    }
    p.curveVertex(x + waveAmount, bottom - plantHeight - 10);
    p.curveVertex(x - 5 + waveAmount, bottom - plantHeight);
    for (let y = plantHeight; y > 0; y -= 10) {
      const xOffset = p.sin((y / plantHeight) * p.PI + p.frameCount * 0.02) * 8 + waveAmount;
      p.curveVertex(x - stemWidth + xOffset, bottom - y);
    }
    p.endShape(p.CLOSE);

    // Desenăm frunze
    p.fill(leafColor);
    for (let i = 1; i < 4; i++) {
      const leafY = bottom - (plantHeight * i / 4);
      const leafSize = (plantHeight / 4) * 0.8;
      const waveOffset = p.sin(p.frameCount * 0.03 + i) * 4;

      // Frunză stânga
      p.beginShape();
      p.vertex(x, leafY);
      p.bezierVertex(
        x - leafSize / 2, leafY - leafSize / 4 + waveOffset,
        x - leafSize, leafY + waveOffset,
        x - leafSize / 3, leafY + leafSize / 3 + waveOffset
      );
      p.endShape(p.CLOSE);

      // Frunză dreapta
      p.beginShape();
      p.vertex(x, leafY);
      p.bezierVertex(
        x + leafSize / 2, leafY - leafSize / 4 - waveOffset,
        x + leafSize, leafY - waveOffset,
        x + leafSize / 3, leafY + leafSize / 3 - waveOffset
      );
      p.endShape(p.CLOSE);
    }
  };

  const drawBubbles = () => {
    // Actualizăm și desenăm bulele
    p.fill(255, 255, 255, 150);

    bubbles.forEach((bubble, index) => {
      // Mișcăm bulele în sus
      bubble.y -= bubble.speed;

      // Adăugăm mișcare laterală ușoară
      bubble.x += p.sin(p.frameCount * 0.1 + index) * 0.3;

      // Verificăm dacă bula este în limitele canvas-ului
      if (bubble.x >= 0 && bubble.x <= width && bubble.y >= 0 && bubble.y <= height) {
        // Desenăm bula cu efect de strălucire
        p.ellipse(bubble.x, bubble.y, bubble.size);
        p.fill(255, 255, 255, 200);
        p.ellipse(bubble.x - bubble.size / 4, bubble.y - bubble.size / 4, bubble.size / 3);
      }

      // Resetăm bula dacă a ieșit din acvariu
      if (bubble.y < -10) {
        bubble.y = height + p.random(10, 50);
        bubble.x = p.random(width);
      }
    });
  };

  const drawWaterSurface = () => {
    // Efecte de suprafață ale apei
    p.noStroke();
    for (let i = 0; i < 3; i++) {
      const alpha = p.map(i, 0, 3, 20, 5);
      p.fill(210, 20, 95, alpha);

      p.beginShape();
      for (let x = 0; x <= width; x += 30) {
        const waveHeight = 3 + i * 2;
        const y = waveHeight * p.sin(x * 0.01 + p.frameCount * 0.03 + i);
        p.curveVertex(x, y);
      }
      p.vertex(width, 0);
      p.vertex(0, 0);
      p.endShape(p.CLOSE);
    }
  };

  const drawFish = (fish: FishProps, isPlayer: boolean) => {
    if (!fish) return;

    p.push();
    p.translate(fish.x, fish.y);

    // Direcție corectă
    let angle = fish.direction;
    // Inversăm direcția dacă peștele merge spre stânga
    if (angle > p.PI / 2 && angle < 3 * p.PI / 2) {
      angle += p.PI;
    }
    p.rotate(angle);

    // Obținem culorile peștelui
    let baseColor;
    try {
      baseColor = p.color(fish.color);
    } catch (e) {
      // Fallback în caz că culoarea nu poate fi interpretată
      baseColor = p.color('#FF4757');
    }

    const highlightColor = p.lerpColor(baseColor, p.color(255), 0.3);
    const shadowColor = p.lerpColor(baseColor, p.color(0), 0.3);

    // Dimensiunea peștelui
    const fishLength = fish.size;
    const fishHeight = fish.size * 0.6;

    // Mișcarea cozii
    const tailWag = p.sin(p.frameCount * 0.2) * 0.2;

    // Corpul peștelui
    p.noStroke();
    p.fill(baseColor);
    p.ellipse(0, 0, fishLength, fishHeight);

    // Adăugăm gradient pentru profunzime
    p.fill(highlightColor);
    p.ellipse(-fishLength * 0.1, -fishHeight * 0.1, fishLength * 0.8, fishHeight * 0.6);

    // Coada peștelui
    p.fill(baseColor);
    p.triangle(
      -fishLength * 0.5, 0,
      -fishLength * 0.7, -fishHeight * 0.5 + tailWag * fishHeight,
      -fishLength * 0.7, fishHeight * 0.5 + tailWag * fishHeight
    );

    // Aripioare
    p.fill(p.lerpColor(baseColor, p.color(0), 0.1));

    // Aripioara de sus
    p.triangle(
      0, -fishHeight * 0.4,
      -fishLength * 0.2, -fishHeight * 0.7,
      -fishLength * 0.4, -fishHeight * 0.4
    );

    // Aripioara de jos
    p.triangle(
      0, fishHeight * 0.4,
      -fishLength * 0.2, fishHeight * 0.7,
      -fishLength * 0.4, fishHeight * 0.4
    );

    // Aripioare laterale
    p.triangle(
      fishLength * 0.1, fishHeight * 0.2,
      fishLength * 0.3, fishHeight * 0.3,
      fishLength * 0.1, fishHeight * 0.4
    );

    p.triangle(
      fishLength * 0.1, -fishHeight * 0.2,
      fishLength * 0.3, -fishHeight * 0.3,
      fishLength * 0.1, -fishHeight * 0.4
    );

    // Ochiul
    p.fill(255);
    p.ellipse(fishLength * 0.25, -fishHeight * 0.1, fishLength * 0.15, fishHeight * 0.15);
    p.fill(0);
    p.ellipse(fishLength * 0.3, -fishHeight * 0.1, fishLength * 0.07, fishHeight * 0.07);

    // Efecte speciale pentru peștele jucător
    if (isPlayer) {
      // Contur strălucitor
      const glowIntensity = 150 + p.sin(p.frameCount * 0.1) * 50;
      p.stroke(255, 255, 0, glowIntensity);
      p.strokeWeight(2);
      p.noFill();
      p.ellipse(0, 0, fishLength + 4, fishHeight + 4);

      // Trenă de particule pentru jucător
      p.noStroke();
      for (let i = 0; i < 5; i++) {
        const particleSize = (5 - i) * 0.8;
        const distance = (i + 1) * 8;
        const xOffset = p.sin(p.frameCount * 0.1 + i) * 3;
        p.fill(255, 255, 255, 100 - i * 20);
        p.ellipse(-fishLength * 0.6 - distance + xOffset,
          p.sin(p.frameCount * 0.2 + i) * 5,
          particleSize, particleSize);
      }
    }

    p.pop();
  };

  const drawScene = (playerFish: FishProps, aiFishes: FishProps[]) => {
    // Fundalul acvariului - culoare complet opacă
    p.background(210, 80, 30);

    // Desenăm fundalul acvariului
    drawBackground();

    // Desenăm peștii AI
    if (aiFishes && aiFishes.length > 0) {
      aiFishes.forEach(fish => {
        drawFish(fish, false);
      });
    }

    // Desenăm peștele jucător
    if (playerFish) {
      drawFish(playerFish, true);
    }

    // Desenăm efectele de suprafață ale apei
    drawWaterSurface();
  };

  return {
    drawScene,
    drawBackground,
    drawFish,
    drawBubbles,
    drawWaterSurface
  };
};

