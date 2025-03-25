// /components/game/useSound.ts - Hook pentru efecte sonore (versiune simplificată)
export const useSound = () => {
  // Funcții goale pentru a evita erorile în caz că nu există fișierele audio
  const playEatSound = () => {
    console.log("Eat sound would play here");
  };

  const playGameOverSound = () => {
    console.log("Game over sound would play here");
  };

  const playVictorySound = () => {
    console.log("Victory sound would play here");
  };

  return {
    playEatSound,
    playGameOverSound,
    playVictorySound
  };
};

