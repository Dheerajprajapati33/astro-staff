import { useEffect } from "react";
import { createAudioPlayer, setAudioModeAsync } from "expo-audio";

const RINGTONE = require("../assets/images/ringtone.mp3");

let player = null;
let playerInitialization = null;
let activeRequests = 0;

const initializePlayer = () => {
  if (player) return Promise.resolve();
  if (!playerInitialization) {
    playerInitialization = setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    })
      .then(() => {
        player = createAudioPlayer(RINGTONE);
        player.loop = true;
      })
      .catch((error) => {
        playerInitialization = null;
        throw error;
      });
  }

  return playerInitialization;
};

export default function useIncomingRequestRingtone(isActive) {
  useEffect(() => {
    if (!isActive) return undefined;

    activeRequests += 1;
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      activeRequests = Math.max(0, activeRequests - 1);

      if (activeRequests === 0 && player) {
        player.pause();
        player.seekTo(0).catch((error) => {
          console.error("[IncomingRequestRingtone] Could not rewind ringtone:", error);
        });
      }
    };

    initializePlayer()
      .then(() => {
        if (activeRequests > 0) player.play();
      })
      .catch((error) => {
        console.error("[IncomingRequestRingtone] Could not play ringtone:", error);
        release();
      });

    return release;
  }, [isActive]);
}
