/**
 * Utility for High-Quality Thai text-to-speech
 * Uses a local API proxy to Google TTS with a fallback to Web Speech API
 */

interface SpeakOptions {
  onEnd?: () => void;
  onStart?: () => void;
}

let currentAudio: HTMLAudioElement | null = null;

// Fallback to Web Speech API
const speakWebSpeech = (text: string, options?: SpeakOptions) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.rate = 0.8;

  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find(v => v.lang === "th-TH" || v.name.includes("Thai"));
  if (thaiVoice) utterance.voice = thaiVoice;

  if (options?.onStart) utterance.onstart = options.onStart;
  if (options?.onEnd) utterance.onend = options.onEnd;

  window.speechSynthesis.speak(utterance);
};

const speak = (text: string, options?: SpeakOptions) => {
  if (typeof window === "undefined") return;

  // Stop any ongoing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  const processedText = text.replace(/\./g, ' ');
  
  // Use our internal API proxy to avoid CORS and 404 issues
  const url = `/api/tts?text=${encodeURIComponent(processedText)}`;

  const audio = new Audio();
  audio.src = url;
  currentAudio = audio;

  if (options?.onStart) {
    options.onStart();
  }

  audio.onended = () => {
    if (options?.onEnd) options.onEnd();
    currentAudio = null;
  };

  audio.onerror = () => {
    console.warn("Proxy TTS failed, falling back to Web Speech API.");
    speakWebSpeech(processedText, options);
    currentAudio = null;
  };

  audio.play().catch(err => {
    console.warn("Autoplay blocked or playback error, attempting fallback:", err);
    speakWebSpeech(processedText, options);
  });
};

const stop = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

const playEffect = (type: 'correct' | 'incorrect') => {
  if (typeof window === "undefined") return;

  const effects = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3', // เสียง "Cheers" สั้นๆ
    incorrect: 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3'   // เสียง "Buzz" หรือ "Oops"
  };

  const audio = new Audio(effects[type]);
  audio.volume = 0.5;
  audio.play().catch(err => console.warn("Effect playback failed:", err));
};

export { speak, stop, playEffect };
export type { SpeakOptions };
