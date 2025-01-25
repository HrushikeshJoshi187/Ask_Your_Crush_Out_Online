document.addEventListener("DOMContentLoaded", () => {
  const playMusic = () => {
    music1.play().catch((error) => {
      console.error("Error playing music:", error);
      document.addEventListener("click", playMusicOnInteraction);
    });
  };

  const playMusicOnInteraction = () => {
    music1.play().catch((error) => {
      console.error("Error playing music on interaction:", error);
    });
    document.removeEventListener("click", playMusicOnInteraction);
  };

  playMusic();
});
