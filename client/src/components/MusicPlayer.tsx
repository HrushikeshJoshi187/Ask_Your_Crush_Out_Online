import { useState, useEffect, useRef } from "react";

import game_music_1 from "../assets/music/game_music_1.mp3";
import sad_music_1 from "../assets/music/sad_music_1.mp3";

interface MusicPlayerProps {
  state: "requirement" | "question" | "decision" | "victory" | "defeat";
}

const MusicPlayer = ({ state }: MusicPlayerProps): JSX.Element => {
  const [canPlayMusic, setCanPlayMusic] = useState<boolean>(false);

  const music1Ref = useRef<HTMLAudioElement | null>(null);
  const music2Ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const music1 = music1Ref.current!;

    const playMusicOnInteraction = () => {
      music1.play().catch((error) => {
        console.error("Error playing music on interaction:", error);
      });
      setCanPlayMusic(true);
      document.removeEventListener("click", playMusicOnInteraction);
    };

    const playMusic = () => {
      if (!canPlayMusic) {
        document.addEventListener("click", playMusicOnInteraction);
      }
    };

    playMusic();

    return () => {
      document.removeEventListener("click", playMusicOnInteraction);
    };
  }, [canPlayMusic]);

  useEffect(() => {
    if (state === "defeat") {
      if (music1Ref.current && canPlayMusic) {
        music1Ref.current.pause();
      }
      if (music2Ref.current && canPlayMusic) {
        music2Ref.current.play().catch((error) => {
          console.error("Error playing music:", error);
        });
      }
    } else {
      if (music2Ref.current && canPlayMusic) {
        music2Ref.current.pause();
      }
      if (music1Ref.current && music1Ref.current.paused && canPlayMusic) {
        music1Ref.current.play().catch((error) => {
          console.error("Error playing music:", error);
        });
      }
    }
  }, [state, canPlayMusic]);

  return (
    <div className="music_player">
      <audio
        id="music_1"
        ref={music1Ref}
        src={game_music_1}
        preload="auto"
        loop
      />
      <audio
        id="music_2"
        ref={music2Ref}
        src={sad_music_1}
        preload="auto"
        loop
      />
    </div>
  );
};

export default MusicPlayer;
