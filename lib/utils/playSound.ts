export const playWarningSound = () => {
  const audio = new Audio("/sounds/warning.mp3");
  audio.play();
};

export const playErrorSound = () => {
  const audio = new Audio("/sounds/error.mp3");
  audio.play();
};

export const playSuccessSound = () => {
  const audio = new Audio("/sounds/success.mp3");
  audio.play();
};

let incomingAudio = null;

export const playInCommingSound = () => {
  if (!incomingAudio) {
    incomingAudio = new Audio("/sounds/inCommingCall.mp3");
    incomingAudio.loop = true;
  }
  incomingAudio.play();
};

export const stopInCommingSound = () => {
  if (incomingAudio) {
    incomingAudio.pause();
    incomingAudio.currentTime = 0;
    incomingAudio = null;
  }
};
