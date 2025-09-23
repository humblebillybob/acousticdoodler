// Simple Web Audio API Synthesizer
class SimpleAudioSynth {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("Audio initialization failed:", error);
      return false;
    }
  }

  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume;
    }
  }

  playNote(frequency, duration = 0.5) {
    if (!this.isInitialized || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(
      frequency,
      this.audioContext.currentTime
    );

    const attackTime = 0.01;
    const releaseTime = 0.3;
    const sustainLevel = 0.3;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      sustainLevel,
      this.audioContext.currentTime + attackTime
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration + releaseTime);
  }

  playChord(frequencies, duration = 2.0) {
    if (!this.isInitialized || !this.audioContext) return;

    frequencies.forEach((frequency, index) => {
      setTimeout(() => {
        this.playNote(frequency, duration);
      }, index * 30);
    });
  }
}