// Offline Spatial Audio Cueing & Web Speech API TTS for ASTRA-PVT

let audioCtx: AudioContext | null = null;
let isMutedGlobal = false;

export function setSpatialAudioMuted(muted: boolean) {
  isMutedGlobal = muted;
  if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Play a 3D HRTF spatial audio beep pointing toward the misplaced tool's 3D direction relative to astronaut
 * @param x -1.0 (left) to +1.0 (right)
 * @param y -1.0 (down) to +1.0 (up)
 * @param z -1.0 (behind) to +1.0 (front)
 */
export function playSpatialAudioBeep(x: number = 0.8, y: number = 0.2, z: number = -0.5) {
  if (isMutedGlobal) return;
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Use PannerNode if supported for HRTF 3D spatialization
    if (audioCtx.createPanner) {
      const panner = audioCtx.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 10000;
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 0;
      panner.coneOuterGain = 0;

      if (panner.positionX) {
        panner.positionX.setValueAtTime(x * 5, audioCtx.currentTime);
        panner.positionY.setValueAtTime(y * 5, audioCtx.currentTime);
        panner.positionZ.setValueAtTime(z * 5, audioCtx.currentTime);
      } else {
        panner.setPosition(x * 5, y * 5, z * 5);
      }

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(audioCtx.destination);
    } else {
      osc.connect(gain);
      gain.connect(audioCtx.destination);
    }

    // Misplaced tool alert tone: 880 Hz pulse
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.warn('Web Audio API spatial beep error:', e);
  }
}

/**
 * On-device TTS using Web Speech API with EN and HI support
 */
export function speakTtsAlert(text: string, lang: 'en' | 'hi' = 'en') {
  if (isMutedGlobal) return;
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis unavailable, using fallback notification text:', text);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.volume = 1.0;
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const langCode = lang === 'hi' ? 'hi' : 'en';
    const voice = voices.find(v => v.lang.startsWith(langCode));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('SpeechSynthesis TTS error:', e);
  }
}
