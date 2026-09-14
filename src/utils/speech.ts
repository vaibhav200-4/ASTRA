// Web Speech API wrapper for ASTRA-PVT voice guidance and warnings

let isMuted = false;

export const setVoiceMuted = (muted: boolean) => {
  isMuted = muted;
  if (muted && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const getVoiceMuted = () => isMuted;

export const speakGuidance = (text: string) => {
  if (isMuted) return;
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    // Cancel any previous speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly authoritative, clear pitch
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to select an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Zira')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to trigger speech synthesis:', err);
  }
};
